# NC Rewards - Campeón del Abarrote

Sales gamification platform for AJE Snacks vendors.

## Deploy on Easypanel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "NC Rewards Phase 1"
   git remote add origin https://github.com/YOUR_USER/nc-rewards.git
   git push -u origin main
   ```

2. **Easypanel Dashboard**
   - Create Service → Git Repository
   - Repository URL: your GitHub repo
   - Dockerfile Path: `deploy/Dockerfile`
   - Port: 80
   - Deploy!

## Local Testing
```bash
docker build -t nc-rewards -f deploy/Dockerfile .
docker run -p 8000:80 nc-rewards
```

Visit: http://localhost:8000/Dashboard%20Admin.html
