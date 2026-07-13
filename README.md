# 🚀 Real-Time Collaborative Workspace Agile Management Tool

A full-stack MERN application inspired by Trello and Jira that enables teams to collaborate in real time. The application provides secure authentication, workspace management, Kanban boards, task tracking, team chat, workspace invitations, notifications, and live collaboration using Socket.IO.

---

## 📌 Project Overview

The **Real-Time Collaborative Workspace Agile Management Tool** is designed to help teams efficiently manage projects using Agile and Kanban methodologies. Users can create workspaces, organize boards, manage tasks, invite team members, communicate in real time, and track project activities from a single platform.

---

## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Password Encryption (bcrypt)

### 📁 Workspace Management
- Create Workspace
- View Workspace
- Delete Workspace
- Invite Members
- Accept / Reject Invitations

### 📋 Board Management
- Create Boards
- Delete Boards
- View Boards

### 📌 Task Management
- Create Lists
- Create Cards
- Edit Cards
- Delete Cards
- Assign Members
- Due Dates
- Drag & Drop Support

### 💬 Collaboration
- Team Chat
- Comments
- Typing Indicator
- Online Users
- Activity Feed
- Notifications

### 🔍 Search
- Search Cards
- Real-Time Search Results

### ⚡ Real-Time Features
- Live Chat
- Online Users
- Typing Indicator
- Notifications
- Activity Updates

---

# 🛠 Tech Stack

## Frontend
- React.js
- React Router
- Zustand
- Axios
- Socket.IO Client

## Backend
- Node.js
- Express.js
- Socket.IO

## Database
- MongoDB
- Mongoose

## Authentication
- JWT
- bcryptjs

## Development Tools
- Git
- GitHub
- VS Code
- Postman

---

# 📂 Project Structure

```
Real-Time-Collaborative-Workspace-Agile-Management-Tool
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── config/
│   └── server.js
│
├── docs/
│   └── Real_Time_Collaborative_Workspace_Project_Documentation.pdf
│
├── README.md
└── package.json
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/ganeshkumar12-hub/Real-Time-Collaborative-Workspace-Agile-Management-Tool-.git
```

Move into project

```bash
cd Real-Time-Collaborative-Workspace-Agile-Management-Tool-
```

---

## Backend Setup

```bash
cd server
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

# 🚀 Implemented Modules

- ✅ User Authentication
- ✅ Workspace Management
- ✅ Board Management
- ✅ Lists
- ✅ Cards
- ✅ Drag & Drop
- ✅ Comments
- ✅ Notifications
- ✅ Activity Feed
- ✅ Search
- ✅ Typing Indicator
- ✅ Workspace Invitations
- ✅ Team Chat
- ✅ Online Users

---

# 📊 Development Timeline

### Week 1
- Project Setup
- Authentication

### Week 2
- Workspace & Board CRUD

### Week 3
- Lists & Cards
- Drag & Drop

### Week 4
- Comments
- Activity Feed
- Notifications
- Search
- Typing Indicator

### Week 5
- Workspace Invitations

### Week 6
- Team Chat

### Week 7
- Online Users

---

# 🚧 Challenges Faced

- JWT Authentication
- MongoDB Relationships
- Socket.IO Synchronization
- Real-Time Chat
- Online User Tracking
- Invitation Workflow
- Drag-and-Drop State Management
- Frontend-Backend Synchronization

---

# 📈 Results

Successfully developed a real-time collaborative workspace management system with:

- Secure Authentication
- Real-Time Collaboration
- Kanban Workflow
- Team Communication
- Workspace Invitations
- Live Notifications
- Activity Tracking
- Online User Monitoring

---

# 🔮 Future Enhancements

- Role-Based Access Control
- File Uploads
- Image Attachments
- Email Notifications
- Calendar View
- Analytics Dashboard
- Docker Support
- Redis Caching
- AWS Deployment
- Mobile Application

---

# 📄 Documentation

Complete project documentation is available in:

```
docs/Real_Time_Collaborative_Workspace_Project_Documentation.pdf
```

---

# 👨‍💻 Author

**Seeripi Ganesh Kumar**

- 📧 Email: seeripi.ganeshkumar@gmail.com
- 💼 LinkedIn: https://www.linkedin.com/in/seeripi-ganesh-kumar/
- 💻 GitHub: https://github.com/ganeshkumar12-hub

---

# ⭐ If you found this project useful, please give it a star!
