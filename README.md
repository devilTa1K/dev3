# DevOps Task Manager

This is a full-stack React.js + Node.js/Express + MongoDB application containerized with Docker, with CI/CD setup via Jenkins Multibranch Pipeline.

## 🚀 Technologies Used
- **Frontend**: React (Vite)
- **Backend**: Node.js, Express, JWT Auth
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **CI/CD**: Jenkins Multibranch Pipeline

## 📁 Project Structure
- `/client` - React Frontend Application
- `/server` - Node.js REST API
- `docker-compose.yml` - Orchestrates frontend, backend, and mongodb.
- `Jenkinsfile` - Declarative CI/CD pipeline logic.

---

## 🛠️ Local Development (Running Manually)

1. **Start the environment**:
   ```bash
   docker-compose up -d --build
   ```
2. **Access the Application**:
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:5000](http://localhost:5000)

3. **Stop the environment**:
   ```bash
   docker-compose down
   ```

---

## 🔄 Jenkins CI/CD Setup

### 1. Initialize Git Repository
Initialize the repository and create the required branches:
```bash
# Initialize and create main branch
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create development and feature branches
git checkout -b dev
git push -u origin dev

git checkout -b feature/login-ui
git push -u origin feature/login-ui

# Ensure all are pushed to your remote repository (e.g. GitHub)
git push origin main dev feature/login-ui
```

### 2. Jenkins Multibranch Pipeline Setup
1. Open Jenkins in your browser (e.g., `http://localhost:8080`).
2. Click **New Item** on the dashboard.
3. Enter a name (e.g., `task-manager-multibranch`) and select **Multibranch Pipeline**.
4. In the configuration:
   - **Branch Sources**: Add **Git** (or GitHub if you have the plugin) and enter your repository URL.
   - **Build Configuration**: Keep Mode as **by Jenkinsfile** and Script Path as `Jenkinsfile`.
5. Click **Save**. Jenkins will scan your repository and automatically create and trigger pipelines for `main`, `dev`, and `feature/login-ui` branches.

### 3. CI/CD Flow
Whenever you push changes to any branch on GitHub, Jenkins will:
1. Detect the change.
2. Checkout the branch.
3. Simulate tests.
4. Build the Docker images.
5. Deploy containers dynamically based on the branch (`prod`, `staging`, `test`).
