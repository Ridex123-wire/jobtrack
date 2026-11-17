# JobTrack – Job Application Tracker

JobTrack is a full-stack job application tracking platform designed to help job seekers organize their applications, monitor progress, and manage their job search from one dashboard.

## Features

- **User Authentication:** Secure registration and login using JWT and password hashing.
- **Dashboard:** View application statistics and track your job search.
- **Application Management:** Add, edit, view, and delete job applications.
- **Search and Filtering:** Search applications and filter them by status.
- **Analytics:** Visualize application progress with charts.
- **Upcoming Interviews:** Keep track of scheduled interviews.
- **Profile Management:** Update your personal information.
- **Password Management:** Change your account password securely.
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

_The folder structure above is a simplified overview._

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
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
MONGO_URI=your_mongodb_connection_string
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

## Future Improvements

- Email notifications for interviews.
- Job application reminders.
- More detailed analytics.
- Deployment of the full application.

## Author

**Ridwan Adekunle**

Frontend Developer | Growing Full-Stack Developer

GitHub: [Ridex123-wire](https://github.com/Ridex123-wire)

Portfolio: Add your live Devora portfolio URL here.

---

Built with dedication by Ridwan Adekunle.
