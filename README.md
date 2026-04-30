# PromptJudge

A full-stack web application where Admins create tasks with prompts, the system automatically generates AI responses (or allows manual entry), and Taskers evaluate responses using multiple parameters.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT
- **AI:** Google Gemini API

## Features

- JWT-based authentication (Signup/Login)
- Role-based access (Admin/Tasker)
- Admin: Create tasks, view all tasks, assign tasks
- Tasker: View assigned tasks, generate/enter responses, evaluate and update status
- Auto AI response generation using Gemini API
- Manual Response Fallback: If API generation fails, Taskers can manually input responses from ChatGPT and Gemini.
- Evaluation with sliders (1-5): Instruction Following, Truthfulness, Writing Style, Verbosity
- Modern Dashboard with task statistics and UI animations

## Project Structure

```
ethara_project/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── ai.js
│   │   │   ├── auth.js
│   │   │   └── tasks.js
│   │   ├── utils/
│   │   │   └── gemini.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── CreateTask.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── TaskDetail.jsx
    │   │   ├── TaskList.jsx
    │   │   └── Welcome.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    └── package.json
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key

### Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### Demo Flow

1. **Signup/Login**
   - Go to `/signup` and create an account
   - Choose "Admin" role for creating tasks
   - Or "Tasker" role for evaluating tasks

2. **Create Task (Admin)**
   - Log into the Admin Portal
   - Go to "Create Task"
   - Enter title, description, and prompt
   - Select deadline and assign to a Tasker
   - Click "Create Task"

3. **Evaluate Responses (Tasker)**
   - Log into the Tasker Portal and open the assigned task
   - Generate AI responses (if the API fails, manually paste ChatGPT and Gemini responses)
   - Read and compare both responses
   - Rate each response using the evaluation sliders
   - Select preferred response and submit the evaluation

4. **View Dashboard**
   - See total tasks, completed tasks, overdue tasks
   - View success and completion rates

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users (admin)

### Tasks
- `POST /api/tasks` - Create task (admin, auto-generates AI responses)
- `GET /api/tasks` - Get all tasks (filtered by user role)
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id/status` - Update task status
- `POST /api/tasks/:id/evaluate` - Submit evaluation

### AI
- `POST /api/ai/generate` - Generate AI responses (manual endpoint)

## Final Score Calculation

```
finalScore = (
  instructionFollowing × 0.3 +
  truthfulness × 0.3 +
  writingStyle × 0.2 +
  verbosity × 0.2
)
```

## Deployment

### Backend (Railway)

1. Connect GitHub repo to Railway
2. Set environment variables
3. Railway auto-detects Node.js and deploys

### Frontend (Vercel)

1. Import project to Vercel
2. Set `VITE_API_URL` to your backend URL
3. Deploy

### MongoDB Atlas

1. Create free cluster
2. Get connection string
3. Add IP to whitelist
4. Use in backend `MONGO_URI`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret for JWT signing | any_random_string |
| GEMINI_API_KEY | Google Gemini API key | AIza... |
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## License

MIT