You are a senior full-stack engineer. Build a complete production-ready web application:

"AI Task Manager with Gemini Response Evaluation"

---

## 🎯 Objective
Build a full-stack system where:
- Users authenticate
- Admin creates tasks with a prompt
- System automatically generates TWO AI responses using Google Gemini API
- Users evaluate both responses using multiple parameters
- Dashboard shows task stats and evaluation insights

---

## 🧱 Tech Stack (STRICT)
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT
- AI: Google Gemini API (@google/generative-ai)
- Deployment-ready (Railway + Vercel)

---

## 🔐 Authentication
- Signup/Login (JWT-based)
- Password hashing (bcrypt)
- Protected routes

Roles:
- Admin
- Member

---

## 👥 Role-Based Access
Admin:
- Create tasks
- View all tasks
- Assign tasks

Member:
- View assigned tasks
- Evaluate responses
- Update task status

---

## 📁 Database Models

### User
- name
- email
- password
- role (admin/member)

---

### Task
- title
- description
- prompt (string)

- responseA (string)
- responseB (string)

- ratings:
    - instructionFollowing (1–5)
    - truthfulness (1–5)
    - writingStyle (1–5)
    - verbosity (1–5)

- preferredResponse ("A" or "B")

- finalScore (number)

- status (pending/completed)
- assignedTo (userId)
- deadline (date)

---

## 🧠 AI Response Generation (IMPORTANT)

Use Google Gemini API.

Install:
npm install @google/generative-ai

---

### Logic:
When admin creates a task with a prompt:

Call Gemini API TWICE:

1. Response A → temperature: 0.4 (more factual)
2. Response B → temperature: 0.9 (more creative)

---

### Backend Function

Create a utility:

generateResponses(prompt)

It should:
- Call Gemini model "gemini-pro"
- Return:
  {
    responseA: string,
    responseB: string
  }

---

### API Route

POST /api/ai/generate

Input:
{
  prompt: string
}

Output:
{
  responseA,
  responseB
}

---

### Integration in Task Creation

When creating task:
- Auto call generateResponses(prompt)
- Store responses in DB

---

## 🧮 Final Score Logic

finalScore = (
  instructionFollowing * 0.3 +
  truthfulness * 0.3 +
  writingStyle * 0.2 +
  verbosity * 0.2
)

---

## 🔌 Backend APIs

### Auth
- POST /api/auth/signup
- POST /api/auth/login

---

### Tasks
- POST /api/tasks (Admin only → auto-generate responses)
- GET /api/tasks (user-specific)
- GET /api/tasks/:id

- PUT /api/tasks/:id/status

---

### Evaluation
- POST /api/tasks/:id/evaluate

Input:
{
  instructionFollowing,
  truthfulness,
  writingStyle,
  verbosity,
  preferredResponse
}

Output:
- Save ratings
- Calculate finalScore

---

## 🎨 Frontend Pages

### 1. Auth
- Login / Signup

---

### 2. Dashboard
- Cards:
  - Total Tasks
  - Completed Tasks
  - Overdue Tasks

---

### 3. Create Task (Admin)
- Inputs:
  - Title
  - Description
  - Prompt
  - Deadline
  - Assign User

- On submit:
  - Call backend
  - Auto-generate responses

- Show loading spinner while generating

---

### 4. Task List
- Show all tasks
- Status badges

---

### 5. Task Detail Page (IMPORTANT)

Display:
- Prompt
- Response A (label: "More Accurate")
- Response B (label: "More Creative")

---

### Evaluation UI:
- Dropdowns / sliders (1–5):
    - Instruction Following
    - Truthfulness
    - Writing Style
    - Verbosity

- Select:
    - Preferred Response (A or B)

- Submit button

---

## 📊 UI Requirements
- Tailwind CSS modern UI
- Responsive design
- Cards and clean layout
- Loading states for AI generation

---

## ⚙️ Extra Logic
- Overdue = deadline passed AND not completed
- Only assigned user can evaluate
- Only admin can create tasks

---

## 🌐 Deployment
- Backend: Railway
- Frontend: Vercel
- MongoDB Atlas
- Use .env for:
    - MONGO_URI
    - JWT_SECRET
    - GEMINI_API_KEY

---

## 📦 Deliverables
- Full code (frontend + backend)
- Folder structure
- README.md:
    - Setup steps
    - API docs
    - Env variables
- Sample .env file

---

## 🎥 Demo Flow (add in README)
1. Signup/Login
2. Create Task with prompt
3. Auto AI responses generated
4. Open task
5. Evaluate responses
6. View dashboard

---

## ⭐ Code Quality
- Clean folder structure
- MVC pattern (backend)
- Reusable components
- Proper error handling
- Async/await usage

---

## 🚀 BONUS (if possible)
- Charts for evaluation stats
- Filter tasks
- Search tasks
- Notification for new tasks

---

## ⚠️ Important Instructions
- Build step-by-step
- Ensure code is working
- Do not skip any part
- Make it production-ready

---

Output:
1. Backend code
2. Frontend code
3. Setup guide
4. Deployment steps