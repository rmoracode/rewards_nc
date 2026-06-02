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
   - Dockerfile Path: `Dockerfile`  *(en la raíz, NO `deploy/Dockerfile`)*
   - Port: 80
   - Deploy!

## URLs
- `/`             → Selector (Panel Admin / App Vendedor)
- `/admin.html`   → Panel Admin
- `/vendedor.html`→ App Vendedor

## Local Testing
```bash
# Con Docker:
docker build -t nc-rewards .
docker run -p 8000:80 nc-rewards

# Sin Docker (Python):
py -m http.server 8000
```

Visit: http://localhost:8000/
