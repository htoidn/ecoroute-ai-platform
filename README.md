# 🌍 EcoRoute AI Platform

EcoRoute AI is a web-based platform designed to provide personalized and sustainable travel recommendations using artificial intelligence and environmental data.

---

## 🚀 Features

- Personalized travel itineraries
- Sustainability scoring for destinations
- AI-powered recommendation engine
- Real-time environmental insights
- Secure authentication (JWT-based)

---

## 🏗️ Tech Stack

### Frontend
- React (TypeScript)
- Styled Components
- PrimeReact (UI Library)
- vite (Build Tool)
- Axios (API Calls)

### Backend
- Spring Boot (Java)

### AI/ML
- Python
- Uvicorn
- FastAPI
- Scikit-learn

### Database
- PostgreSQL

### DevOps
- Docker
- GitHub Actions (CI/CD)
- Helm
- Cloud (GCP)

---

## 📁 Project Structure
- ecoroute-ai-platform/
- │
- ├── helm/
- ├── frontend/
- ├           /tests/
- ├── backend/
- ├          /tests/
- ├── ai-engine/
- ├── database/
- ├── docs/
- ├── design/
- ├── docker
- └── README.md

---

## 🔧 Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/htoidn/ecoroute-ai-platform.git
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
INFO: Vite dev server running at http://localhost:3000

Note on testing and dev-dependencies:
- The frontend includes testing libraries (Vitest and @testing-library/*). The project pins @testing-library/react to a version compatible with React 19. If you encounter peer-dependency errors during `npm install` (especially on older npm versions), run:

```bash
npm install --legacy-peer-deps
```

This will relax strict peer resolution for local development. For production Docker builds the image installs only production dependencies to avoid installing devDependencies.

### 3.  Run Backend
```bash
cd backend
./gradle bootRun
```
- INFO: Spring Boot app running at http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Health endpoint: http://localhost:8080/actuator/health

### 4. Run AI Engine
```bash 
cd ai-engine/app
pip install -r requirements.txt
uvicorn main:app --reload 
```
- INFO: FastAPI running on http://127.0.0.1:8000 OR http://localhost:8000
- Swagger AI Docs: http://localhost:8000/docs
- Health endpoint: http://localhost:8000/health

### 5. Run Database
- INFO: PostgreSQL running on localhost:5432

---

## 🌿 Branching Strategy
- main → Production-ready code
- develop → Integration branch
- feat/* → Feature development
- hotfix/* → Bug fixes

---

## 📝 Commit Message Format
- feat: add new feature
- hotfix: resolve bug
- docs: update documentation
- refactor: improve code structure

---

## 🔐 Security
- JWT Authentication
- HTTPS Encryption
- Secure API Gateway

---

## 📊 Commit Message Format
- Website app integration
- Advanced AI models
- Real-time notifications
- Smart route optimization

---

## 👨‍💻 Contributor
- MSIT Student: S521698

---

## 📜 License
This project is for Academic and Research purposes.






