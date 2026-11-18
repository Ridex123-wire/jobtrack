# JobTrack – Job Application Tracker

🚀 **Live Demo:** https://jobtrack-ridwan.vercel.app/

JobTrack is a full-stack job application tracking platform designed to help job seekers organize their applications, monitor progress, and manage their job search from one dashboard.

## Features

- **User Authentication:** Secure registration and login using JWT and password hashing.
- **Dashboard:** View application statistics and track your job search.
- **Application Management:** Add, edit, view, and delete job applications.
- **Search and Filtering:** Search applications and filter them by status.
- **Analytics:** Visualize application progress with charts.
- **Upcoming Interviews:** Keep track of scheduled interviews.
- **Profile Management:** Update personal information.
- **Password Management:** Change account passwords securely.
- **Theme Support:** Switch between light and dark modes.
- **Data Persistence:** Store application data in MongoDB.
- **Responsive Design:** Works across desktop and mobile screens.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

## Live Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

## Project Structure

```text
jobtrack/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── ...
├── index.html
├── package.json
└── README.md
```

*The folder structure above is a simplified overview.*

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Ridex123-wire/jobtrack.git
```

### 2. Open the project

```bash
cd jobtrack
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

### 5. Set up the backend

Open another terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Add your own MongoDB connection string and a strong JWT secret. Never commit your `.env` file.

Start the backend using the development command configured in your backend `package.json`.

## What I Learned

Building JobTrack helped me improve my skills in:

- Building full-stack applications with React and Node.js.
- Creating REST APIs with Express.
- Connecting applications to MongoDB.
- Implementing authentication and protected routes.
- Managing application state in React.
- Creating data visualizations.
- Building responsive user interfaces.
- Handling user profiles and password updates.
- Deploying frontend and backend applications.

## Future Improvements

- Email notifications for interviews.
- Job application reminders.
- More detailed analytics.
- Additional dashboard features.

## Author

**Ridwan Adekunle**

Frontend Developer | Growing Full-Stack Developer

GitHub: https://github.com/Ridex123-wire

Portfolio: Add your live Devora portfolio URL here.

---

Built with dedication by Ridwan Adekunle.
