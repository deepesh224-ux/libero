# LIBERO Italia — Premium Football Boots

![Deploy to Amazon ECS](https://github.com/deepesh224-ux/libero/actions/workflows/deploy-aws.yml/badge.svg)

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend** | [http://football-alb-1862504128.us-east-1.elb.amazonaws.com](http://football-alb-1862504128.us-east-1.elb.amazonaws.com) |
| **Backend API** | [http://football-alb-1862504128.us-east-1.elb.amazonaws.com:5001/api/products](http://football-alb-1862504128.us-east-1.elb.amazonaws.com:5001/api/products) |
| **Health Check** | [http://football-alb-1862504128.us-east-1.elb.amazonaws.com:5001/api/health](http://football-alb-1862504128.us-east-1.elb.amazonaws.com:5001/api/health) |

---

## 🏗️ Architecture

LIBERO is a high-fidelity, interactive full-stack e-commerce web application deployed on **AWS ECS Fargate** with an **Application Load Balancer** for stable, permanent URLs.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite, GSAP animations, Three.js 3D |
| **Backend** | Node.js + Express.js |
| **Database** | SQLite with Prisma ORM |
| **Containerization** | Docker (multi-stage builds) |
| **Registry** | AWS ECR |
| **Compute** | AWS ECS Fargate |
| **Load Balancer** | AWS Application Load Balancer (ALB) |
| **CI/CD** | GitHub Actions |
| **Payments** | Razorpay |

### Design Decisions
- **3D Interactive Elements**: WebGL 3D boot model via Three.js for immersive product display.
- **ALB for stable URLs**: Application Load Balancer ensures the frontend/backend URLs never change across redeployments.
- **Fargate (Serverless containers)**: No EC2 instances to manage — AWS handles scaling automatically.
- **Secrets Management**: All sensitive keys (JWT, Razorpay) stored in GitHub Secrets and injected at deploy time.

---

## 🚀 CI/CD Pipeline

Every push to `main` automatically:
1. Builds Docker images for frontend and backend.
2. Pushes images to **AWS ECR**.
3. Updates **ECS services** with the new image.
4. Injects secrets (JWT, Razorpay) into the task definition.

---

## 🛠️ Local Development

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Run both frontend and backend
npm run dev
```

## ☁️ AWS Infrastructure Setup (First Time)

```bash
# 1. Set AWS credentials
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."

# 2. Set up Application Load Balancer
bash scripts/setup-alb.sh

# 3. Create ECS services with ALB
bash scripts/recreate-services.sh
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/orders` | Get user orders |
| POST | `/api/orders` | Create order |
| POST | `/api/payment` | Create Razorpay order |
| GET | `/api/health` | Health check |
