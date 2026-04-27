#!/bin/bash
# setup-alb.sh - Creates Application Load Balancer for stable URLs

set -e
export AWS_PAGER=""  # Disable pager so script doesn't get stuck
REGION="us-east-1"
CLUSTER="football-cluster"

echo "🔍 Getting VPC and Subnet info..."
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text --region $REGION)
SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[*].SubnetId" --output text --region $REGION | tr '\t' ',')
echo "VPC: $VPC_ID"
echo "Subnets: $SUBNETS"

echo ""
echo "🔒 Getting or Creating Security Group for ALB..."
ALB_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=football-alb-sg" "Name=vpc-id,Values=$VPC_ID" \
  --query "SecurityGroups[0].GroupId" --output text --region $REGION 2>/dev/null)

if [ -z "$ALB_SG_ID" ] || [ "$ALB_SG_ID" == "None" ]; then
  ALB_SG_ID=$(aws ec2 create-security-group \
    --group-name football-alb-sg \
    --description "Security group for Football ALB" \
    --vpc-id $VPC_ID \
    --region $REGION \
    --query "GroupId" --output text)
  aws ec2 authorize-security-group-ingress --group-id $ALB_SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $REGION
  aws ec2 authorize-security-group-ingress --group-id $ALB_SG_ID --protocol tcp --port 5001 --cidr 0.0.0.0/0 --region $REGION
  echo "✅ Created Security Group: $ALB_SG_ID"
else
  echo "♻️  Reusing existing Security Group: $ALB_SG_ID"
fi

echo ""
echo "⚖️ Getting or Creating Application Load Balancer..."
ALB_ARN=$(aws elbv2 describe-load-balancers --names football-alb --query "LoadBalancers[0].LoadBalancerArn" --output text --region $REGION 2>/dev/null || true)

if [ -z "$ALB_ARN" ] || [ "$ALB_ARN" == "None" ]; then
  ALB_ARN=$(aws elbv2 create-load-balancer \
    --name football-alb \
    --subnets $(echo $SUBNETS | tr ',' ' ') \
    --security-groups $ALB_SG_ID \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4 \
    --region $REGION \
    --query "LoadBalancers[0].LoadBalancerArn" --output text)
  echo "✅ Created ALB"
else
  echo "♻️  Reusing existing ALB"
fi

ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --query "LoadBalancers[0].DNSName" --output text --region $REGION)
echo "ALB DNS: $ALB_DNS"

echo ""
echo "🎯 Getting or Creating Target Groups..."
CLIENT_TG_ARN=$(aws elbv2 describe-target-groups --names football-client-tg --query "TargetGroups[0].TargetGroupArn" --output text --region $REGION 2>/dev/null || true)
if [ -z "$CLIENT_TG_ARN" ] || [ "$CLIENT_TG_ARN" == "None" ]; then
  CLIENT_TG_ARN=$(aws elbv2 create-target-group \
    --name football-client-tg \
    --protocol HTTP --port 80 \
    --vpc-id $VPC_ID --target-type ip \
    --health-check-path "/" \
    --health-check-interval-seconds 30 \
    --region $REGION \
    --query "TargetGroups[0].TargetGroupArn" --output text)
  echo "✅ Created Client Target Group"
else
  echo "♻️  Reusing existing Client Target Group"
fi

SERVER_TG_ARN=$(aws elbv2 describe-target-groups --names football-server-tg --query "TargetGroups[0].TargetGroupArn" --output text --region $REGION 2>/dev/null || true)
if [ -z "$SERVER_TG_ARN" ] || [ "$SERVER_TG_ARN" == "None" ]; then
  SERVER_TG_ARN=$(aws elbv2 create-target-group \
    --name football-server-tg \
    --protocol HTTP --port 5001 \
    --vpc-id $VPC_ID --target-type ip \
    --health-check-path "/api/health" \
    --health-check-interval-seconds 30 \
    --region $REGION \
    --query "TargetGroups[0].TargetGroupArn" --output text)
  echo "✅ Created Server Target Group"
else
  echo "♻️  Reusing existing Server Target Group"
fi

echo ""
echo "👂 Creating Listeners (skipping if already exist)..."
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP --port 80 \
  --default-actions Type=forward,TargetGroupArn=$CLIENT_TG_ARN \
  --region $REGION > /dev/null 2>&1 && echo "✅ Created port 80 listener" || echo "♻️  Port 80 listener already exists"

aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP --port 5001 \
  --default-actions Type=forward,TargetGroupArn=$SERVER_TG_ARN \
  --region $REGION > /dev/null 2>&1 && echo "✅ Created port 5001 listener" || echo "♻️  Port 5001 listener already exists"

echo ""
echo "🔄 Allowing ALB to reach ECS tasks..."
DEFAULT_SG=$(aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=$VPC_ID" "Name=group-name,Values=default" \
  --query "SecurityGroups[0].GroupId" --output text --region $REGION)

aws ec2 authorize-security-group-ingress --group-id $DEFAULT_SG --protocol tcp --port 80 --source-group $ALB_SG_ID --region $REGION 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id $DEFAULT_SG --protocol tcp --port 5001 --source-group $ALB_SG_ID --region $REGION 2>/dev/null || true

echo ""
echo "✅ ALB Setup Complete!"
echo ""
echo "🌐 Your PERMANENT stable URLs are:"
echo "   Frontend: http://$ALB_DNS"
echo "   Backend:  http://$ALB_DNS:5001/api/products"
echo ""
echo "⚠️  NOTE: ALB takes 2-3 minutes to become active after creation."
echo "     Run the next step to update ECS services to register with the ALB."
echo ""
echo "📋 Save these for the next step:"
echo "   CLIENT_TG_ARN=$CLIENT_TG_ARN"
echo "   SERVER_TG_ARN=$SERVER_TG_ARN"
echo "   ALB_DNS=$ALB_DNS"
