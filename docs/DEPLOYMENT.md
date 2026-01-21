# Deployment Guide

This guide covers various deployment options for the URL Shortener Frontend application.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [Static Hosting](#static-hosting)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring and Health Checks](#monitoring-and-health-checks)

## Environment Setup

### Required Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_BASE_URL_FOR_URL_SHORTENER` | Base URL for the backend API | Yes | - |

### Production Environment

```bash
# Set production environment variables
export REACT_APP_BASE_URL_FOR_URL_SHORTENER=https://your-api.com/api
export NODE_ENV=production
```

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Production deployment
docker-compose up -d

# Development deployment
docker-compose --profile dev up -d
```

### Manual Docker Deployment

```bash
# Build the image
docker build -t url-shortener-frontend:latest .

# Run the container
docker run -d \
  --name url-shortener-frontend \
  -p 80:80 \
  -e REACT_APP_BASE_URL_FOR_URL_SHORTENER=https://your-api.com/api \
  url-shortener-frontend:latest
```

### Docker Health Checks

The container includes health checks that can be monitored:

```bash
# Check container health
docker ps

# View health check logs
docker inspect url-shortener-frontend | grep Health -A 10
```

## Kubernetes Deployment

### Namespace Configuration

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: url-shortener
```

### Deployment Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: url-shortener-frontend
  namespace: url-shortener
  labels:
    app: url-shortener-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: url-shortener-frontend
  template:
    metadata:
      labels:
        app: url-shortener-frontend
    spec:
      containers:
      - name: frontend
        image: ghcr.io/your-org/url-shortener-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_BASE_URL_FOR_URL_SHORTENER
          valueFrom:
            configMapKeyRef:
              name: frontend-config
              key: api-base-url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service Configuration

```yaml
apiVersion: v1
kind: Service
metadata:
  name: url-shortener-frontend-service
  namespace: url-shortener
spec:
  selector:
    app: url-shortener-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

### Ingress Configuration

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: url-shortener-frontend-ingress
  namespace: url-shortener
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: url-shortener-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: url-shortener-frontend-service
            port:
              number: 80
```

### ConfigMap Configuration

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
  namespace: url-shortener
data:
  api-base-url: "https://your-api.com/api"
```

## Static Hosting

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify Deployment

```bash
# Build the application
npm run build

# Deploy the build directory
netlify deploy --prod --dir=build
```

### AWS S3 + CloudFront

1. **Create S3 Bucket**
```bash
aws s3 mb s3://your-bucket-name
aws s3 sync build/ s3://your-bucket-name --delete
```

2. **Configure Static Website Hosting**
```bash
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document index.html
```

3. **Set up CloudFront Distribution**
- Create CloudFront distribution
- Set S3 bucket as origin
- Configure cache behaviors
- Set up SSL certificate

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline includes:

1. **Code Quality Checks**
   - TypeScript type checking
   - ESLint and Prettier formatting
   - Unit tests with coverage

2. **Security Scanning**
   - npm audit
   - Snyk vulnerability scanning

3. **Build and Deploy**
   - Docker image building
   - Multi-environment deployment
   - Health checks and smoke tests

4. **Performance Testing**
   - Lighthouse CI integration
   - Performance thresholds

### Environment-Specific Deployments

#### Staging Environment
- Triggered on pushes to `develop` branch
- Automatic deployment to staging environment
- Performance tests with Lighthouse CI

#### Production Environment
- Triggered on pushes to `main` branch
- Manual approval required for production
- Full smoke test suite

### Secrets Configuration

Required GitHub Secrets:

| Secret | Description |
|--------|-------------|
| `GITHUB_TOKEN` | GitHub token for container registry |
| `SNYK_TOKEN` | Snyk API token for security scanning |

## Monitoring and Health Checks

### Health Endpoint

The application exposes a health endpoint:

```bash
curl https://your-domain.com/health
# Response: "healthy"
```

### Monitoring Metrics

#### Docker Container Metrics
```bash
# Container resource usage
docker stats url-shortener-frontend

# Container logs
docker logs url-shortener-frontend
```

#### Kubernetes Metrics
```bash
# Pod status
kubectl get pods -n url-shortener

# Pod logs
kubectl logs -f deployment/url-shortener-frontend -n url-shortener

# Resource usage
kubectl top pods -n url-shortener
```

### Alerting

Set up alerts for:
- Container/pod restarts
- High memory/CPU usage
- Health check failures
- Error rate increases

### Logging

#### Application Logs
- Nginx access and error logs
- Application error logs
- Security event logs

#### Log Aggregation
Consider using:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Fluentd + Elasticsearch
- CloudWatch (AWS)
- Google Cloud Logging

## Security Considerations

### HTTPS Enforcement
- All API calls are forced to use HTTPS in production
- Nginx configuration includes security headers

### Container Security
- Non-root user execution
- Minimal Alpine Linux base
- Security scanning in CI/CD pipeline

### Network Security
- Firewall rules for port access
- VPN/private network for internal services
- API rate limiting

## Troubleshooting

### Common Issues

1. **Container Won't Start**
   ```bash
   # Check logs
   docker logs url-shortener-frontend
   
   # Check configuration
   docker exec -it url-shortener-frontend nginx -t
   ```

2. **Health Check Failing**
   ```bash
   # Test health endpoint manually
   curl http://localhost:80/health
   
   # Check nginx status
   docker exec url-shortener-frontend nginx -s status
   ```

3. **API Connection Issues**
   - Verify environment variables
   - Check network connectivity
   - Review CORS configuration

### Performance Optimization

1. **Caching**
   - Browser caching headers configured
   - CDN for static assets
   - API response caching

2. **Compression**
   - Gzip compression enabled
   - Image optimization
   - Bundle size reduction

3. **Monitoring**
   - Real User Monitoring (RUM)
   - Synthetic monitoring
   - Performance budgets
