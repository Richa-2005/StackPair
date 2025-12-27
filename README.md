# 🛠️ GearGuard – Smart Maintenance Management System

GearGuard is a **full-stack maintenance management system** designed to help organizations efficiently track equipment, manage maintenance requests, and visualize work using dashboards, Kanban boards, and calendars.

It supports **role-based access** for Managers, Technicians, and Employees, ensuring clarity, accountability, and reduced downtime.

---

## 🚀 Features

### 🔐 Authentication & Roles
- Secure **Signup & Login** using JWT
- Role-based access:
  - **Manager** – full control & overview
  - **Technician** – assigned tasks
  - **Employee** – raise maintenance requests

---

### 📊 Dashboard
- Real-time statistics:
  - Total requests
  - New / In Progress / Done / Overdue
  - Average resolution time
- Recent requests table
- Technician workload visualization

---

### 🧩 Kanban Board
- Visual workflow management:
  - **NEW → IN_PROGRESS → DONE**
- Status movement via action buttons
- Assign technicians directly from cards
- Priority indicators (High / Medium / Low)

---

### 📅 Calendar View
- Monthly calendar of scheduled maintenance
- Requests grouped by date
- Clickable events showing:
  - Equipment
  - Priority
  - Status
  - Assigned technician
- Helps with planning and preventive maintenance

---

### 🏭 Equipment Management
- Centralized list of equipment
- Each maintenance request linked to equipment
- Easy tracking of equipment history

---

## 🧑‍💻 Tech Stack

### Frontend
- **React**
- **React Router**
- **Axios**
- Custom CSS (no UI libraries)

### Backend
- **Node.js**
- **Express**
- **PostgreSQL**
- **JWT Authentication**

---
### Frontend
- Uses token stored in `localStorage`
- Automatically attached via Axios interceptor

---

## ▶️ Running the Project

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```
cd client
npm install
npm run dev
```
