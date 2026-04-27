#!/bin/bash
set -e
export AWS_PAGER=""
REGION="us-east-1"

echo "⬇️ Scaling down existing services (if active)..."
aws ecs update-service --cluster football-cluster --service football-client-service --desired-count 0 --region $REGION > /dev/null 2>&1 || true
aws ecs update-service --cluster football-cluster --service football-server-service --desired-count 0 --region $REGION > /dev/null 2>&1 || true

echo "⏳ Waiting 10 seconds for tasks to stop..."
sleep 10

echo "🗑️ Deleting old services..."
aws ecs delete-service --cluster football-cluster --service football-client-service --region $REGION > /dev/null 2>&1 || true
aws ecs delete-service --cluster football-cluster --service football-server-service --region $REGION > /dev/null 2>&1 || true

echo "⏳ Waiting for services to fully drain (this can take 30-60 seconds)..."
while true; do
  STATUS=$(aws ecs describe-services --cluster football-cluster --services football-client-service --region $REGION --query "services[0].status" --output text 2>/dev/null)
  if [ "$STATUS" == "INACTIVE" ] || [ "$STATUS" == "None" ] || [ -z "$STATUS" ]; then
    echo "✅ Services fully drained!"
    break
  fi
  echo "   Still draining ($STATUS)... waiting 10s"
  sleep 10
done

echo "🚀 Creating Client service with ALB..."
aws ecs create-service \
  --cluster football-cluster \
  --service-name football-client-service \
  --task-definition football-client \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-053da9a8006c53185,subnet-0a8f5b61240ca5f1c],securityGroups=[sg-03ebff6db7bae41de],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:485261885777:targetgroup/football-client-tg/8ffd82d3a127b46b,containerName=client,containerPort=80" \
  --region $REGION > /dev/null

echo "🚀 Creating Server service with ALB..."
aws ecs create-service \
  --cluster football-cluster \
  --service-name football-server-service \
  --task-definition football-server \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-053da9a8006c53185,subnet-0a8f5b61240ca5f1c],securityGroups=[sg-03ebff6db7bae41de],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:485261885777:targetgroup/football-server-tg/606fad7b8f1b82c7,containerName=server,containerPort=5001" \
  --region $REGION > /dev/null

echo ""
echo "✅ Done! Services recreated with ALB."
echo ""
echo "🌐 Your PERMANENT URLs (wait 2-3 mins to be active):"
echo "   Frontend: http://football-alb-1862504128.us-east-1.elb.amazonaws.com"
echo "   Backend:  http://football-alb-1862504128.us-east-1.elb.amazonaws.com:5001/api/products"
