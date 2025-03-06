# 🦅 TickHawk Frontend

Welcome to **TickHawk Frontend**, a React-based application for the TickHawk ticket management system.

## 🚀 Features

- **Responsive UI** - Works on desktop and mobile devices
- **Role-based Access** - Different views for admins, agents, and customers
- **Ticket Management** - Create, track, and manage tickets
- **File Attachments** - Upload and download files
- **Reporting** - View ticket statistics and reports
- **User Profiles** - Manage user profiles and settings

## 🔧 Installation

```bash
# Install dependencies
npm install

# Development mode
npm start

# Production build
npm run build
```

## 🐳 Docker

```bash
# Build and run with Docker
docker build -t tickhawk-frontend .
docker run -p 80:80 tickhawk-frontend

# Or use Docker Compose from the root directory
docker compose up app
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API Connection
REACT_APP_API_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## 🖥️ User Interfaces

### Customer Portal
- Create new tickets
- View ticket history
- Reply to tickets
- Attach files
- View reports

### Agent Portal
- View all assigned tickets
- Reply to customer tickets
- Change ticket status
- Assign tickets to other agents
- Manage companies, departments, and users
- View comprehensive reports

## 📚 Main Components

- **Authentication** - Login and session management
- **Layouts** - Different layouts for customer and agent portals
- **Ticket System** - Comprehensive ticket management
- **User Management** - Profile and user administration