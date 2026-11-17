import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./App.css";
import Auth from "./Auth";

const API_URL = "https://jobtrack-pxfd.onrender.com/api/applications";

const statusColors = {
  Applied: "blue",
  Interview: "purple",
  Rejected: "red",
  Offered: "green",
};

function toDateInputValue(dateString) {
  if (!dateString) {
    return new Date().toISOString().split("T")[0];
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    return dateString.slice(0, 10);
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().split("T")[0];
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  if (!dateString) return "—";

  return new Date(`${dateString.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    },
  );
}

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState(
    localStorage.getItem("jobtrack_theme") || "light",
  );
  const [applications, setApplications] = useState([]);

  const [token, setToken] = useState(
    localStorage.getItem("jobtrack_token") || "",
  );

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("jobtrack_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("jobtrack_theme", theme);
  }, [theme]);

  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    company: "",
    role: "",
    date: new Date().toISOString().split("T")[0],
    status: "Applied",
    interviewDate: "",
  });

  function handleAuthSuccess(data) {
    localStorage.setItem("jobtrack_token", data.token);
    localStorage.setItem("jobtrack_user", JSON.stringify(data.user));

    setToken(data.token);
    setCurrentUser(data.user);
    setActivePage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("jobtrack_token");
    localStorage.removeItem("jobtrack_user");

    setToken("");
    setCurrentUser(null);
    setApplications([]);
    setError("");
    setActivePage("dashboard");
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();

    try {
      setProfileLoading(true);
      setProfileMessage("");

      const response = await fetch(
        "https://jobtrack-pxfd.onrender.com/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profileName.trim(),
            email: profileEmail.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update profile.");
      }

      localStorage.setItem("jobtrack_user", JSON.stringify(data.user));
      setCurrentUser(data.user);

      setProfileName(data.user.name);
      setProfileEmail(data.user.email);

      setProfileMessage("Profile updated successfully!");
    } catch (error) {
      setProfileMessage(error.message || "Something went wrong.");
    } finally {
      setProfileLoading(false);
    }
  }

  // Change password
  async function handlePasswordChange(e) {
    e.preventDefault();

    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage("New password must be at least 8 characters.");
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch(
        "https://jobtrack-pxfd.onrender.com/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password change failed.");
      }

      setPasswordMessage("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage(error.message || "Something went wrong.");
    } finally {
      setPasswordLoading(false);
    }
  }

  // Load applications from MongoDB
  useEffect(() => {
    async function fetchApplications() {
      if (!token) {
        setApplications([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load applications.");
        }

        setApplications(data.applications || []);
      } catch (error) {
        setError(error.message || "Could not connect to JobTrack backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [token]);

  function resetForm() {
    setForm({
      company: "",
      role: "",
      date: new Date().toISOString().split("T")[0],
      status: "Applied",
      interviewDate: "",
    });

    setEditingId(null);
    setShowForm(false);
  }

  function openAddForm() {
    setForm({
      company: "",
      role: "",
      date: new Date().toISOString().split("T")[0],
      status: "Applied",
      interviewDate: "",
    });

    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function handleEdit(application) {
    setForm({
      company: application.company,
      role: application.role,
      date: toDateInputValue(application.date),
      status: application.status,
      interviewDate: application.interviewDate
        ? toDateInputValue(application.interviewDate)
        : "",
    });

    setEditingId(application._id);
    setShowForm(true);
    setError("");
  }

  // Delete an application from MongoDB
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete application.");
      }

      setApplications((previous) =>
        previous.filter((application) => application._id !== id),
      );
    } catch (error) {
      setError(error.message || "Something went wrong.");
    }
  }

  // Add or update an application in MongoDB
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      const applicationData = {
        company: form.company.trim(),
        role: form.role.trim(),
        date: form.date,
        status: form.status,
        interviewDate: form.interviewDate,
      };

      const isEditing = Boolean(editingId);

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(applicationData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save application.");
      }

      if (isEditing) {
        setApplications((previous) =>
          previous.map((application) =>
            application._id === editingId ? data.application : application,
          ),
        );
      } else {
        setApplications((previous) => [data.application, ...previous]);
      }

      resetForm();
    } catch (error) {
      setError(error.message || "Something went wrong.");
    }
  }

  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      application.company.toLowerCase().includes(search) ||
      application.role.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const today = new Date().toISOString().split("T")[0];

  const upcomingInterviews = applications
    .filter(
      (application) =>
        application.status === "Interview" &&
        application.interviewDate &&
        application.interviewDate.slice(0, 10) >= today,
    )
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));

  const total = applications.length;

  const interviews = applications.filter(
    (application) => application.status === "Interview",
  ).length;

  const offers = applications.filter(
    (application) => application.status === "Offered",
  ).length;

  const rejected = applications.filter(
    (application) => application.status === "Rejected",
  ).length;

  const monthlyApplications = Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - (11 - index));

    const month = monthDate.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    const count = applications.filter((application) => {
      const applicationDate = new Date(application.date);

      return (
        applicationDate.getMonth() === monthDate.getMonth() &&
        applicationDate.getFullYear() === monthDate.getFullYear()
      );
    }).length;

    return { month, applications: count };
  });

  const statusData = [
    {
      name: "Applied",
      value: applications.filter((app) => app.status === "Applied").length,
    },
    { name: "Interview", value: interviews },
    { name: "Offered", value: offers },
    { name: "Rejected", value: rejected },
  ];

  const pieColors = ["#3b82f6", "#8054c7", "#16a34a", "#ef4444"];

  // AUTHENTICATION CHECK
  if (!token || !currentUser) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // SETTINGS PAGE
  if (activePage === "settings") {
    return (
      <div className={`app ${theme}`}>
        <aside className="sidebar">
          <h2 className="logo">
            JobTrack<span>.</span>
          </h2>

          <p className="menu-label">MENU</p>

          <nav>
            <button
              type="button"
              className="nav-link"
              onClick={() => setActivePage("dashboard")}
            >
              ▦ Dashboard
            </button>
          </nav>

          <div className="sidebar-bottom">
            <p className="menu-label">ACCOUNT</p>

            <button
              type="button"
              className="nav-link active"
              onClick={() => setActivePage("settings")}
            >
              ⚙ Settings
            </button>

            <div className="user-profile">
              <div className="avatar">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{currentUser.name}</strong>
                <small>Job Seeker</small>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                marginTop: "15px",
                padding: "10px",
                width: "100%",
                cursor: "pointer",
                borderRadius: "8px",
              }}
            >
              Log Out
            </button>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="breadcrumb">Pages / Settings</p>
              <h1>Settings</h1>
            </div>
          </header>

          <section className="applications-section">
            <div className="section-heading">
              <div>
                <h2>Account Settings</h2>
                <p>Manage your JobTrack account and preferences.</p>
              </div>
            </div>

            <div className="stat-card">
              <h3>Profile Information</h3>
              <p>Update your personal account information.</p>

              <form onSubmit={handleProfileUpdate}>
                <label>Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />

                <label>Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />

                <button
                  type="submit"
                  className="submit-button"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>

                {profileMessage && (
                  <p style={{ marginTop: "12px" }}>{profileMessage}</p>
                )}
              </form>
            </div>

            <div className="stat-card">
              <h3>Appearance</h3>
              <p>Choose the theme that feels comfortable.</p>

              <div className="theme-options">
                <button
                  type="button"
                  className={
                    theme === "light" ? "theme-option active" : "theme-option"
                  }
                  onClick={() => setTheme("light")}
                >
                  Light Mode
                </button>

                <button
                  type="button"
                  className={
                    theme === "dark" ? "theme-option active" : "theme-option"
                  }
                  onClick={() => setTheme("dark")}
                >
                  Dark Mode
                </button>
              </div>

              <p style={{ marginTop: "12px" }}>
                Current theme: {theme === "light" ? "Light" : "Dark"}
              </p>
            </div>

            <div className="stat-card">
              <h3>Account Security</h3>
              <p>Update your password to keep your account secure.</p>

              <form onSubmit={handlePasswordChange} className="password-form">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />

                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength="8"
                  required
                />

                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength="8"
                  required
                />

                <button
                  type="submit"
                  className="submit-button"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Changing Password..." : "Change Password"}
                </button>

                {passwordMessage && (
                  <p style={{ marginTop: "12px" }}>{passwordMessage}</p>
                )}
              </form>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // ANALYTICS PAGE
  if (activePage === "analytics") {
    return (
      <div className={`app ${theme}`}>
        <aside className="sidebar">
          <h2 className="logo">
            JobTrack<span>.</span>
          </h2>

          <p className="menu-label">MENU</p>

          <nav>
            <button
              type="button"
              className="nav-link"
              onClick={() => setActivePage("dashboard")}
            >
              ▦ Dashboard
            </button>
          </nav>

          <div className="sidebar-bottom">
            <p className="menu-label">ACCOUNT</p>

            <button
              type="button"
              className="nav-link"
              onClick={() => setActivePage("settings")}
            >
              ⚙ Settings
            </button>

            <div className="user-profile">
              <div className="avatar">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{currentUser.name}</strong>
                <small>Job Seeker</small>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                marginTop: "15px",
                padding: "10px",
                width: "100%",
                cursor: "pointer",
                borderRadius: "8px",
              }}
            >
              Log Out
            </button>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="breadcrumb">Pages / Analytics</p>
              <h1>Analytics</h1>
            </div>
          </header>

          <section className="applications-section">
            <div className="section-heading">
              <div>
                <h2>Your Job Search Performance</h2>
                <p>Understand your application progress and results.</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>Total Applications</span>
                <h2>{total}</h2>
                <small>All applications submitted</small>
              </div>

              <div className="stat-card">
                <span>Interviews</span>
                <h2>{interviews}</h2>
                <small>Interview opportunities</small>
              </div>

              <div className="stat-card">
                <span>Offers</span>
                <h2>{offers}</h2>
                <small>Job offers received</small>
              </div>

              <div className="stat-card">
                <span>Rejections</span>
                <h2>{rejected}</h2>
                <small>Applications unsuccessful</small>
              </div>
            </div>
          </section>

          <section className="applications-section">
            <div className="section-heading">
              <div>
                <h2>Application Breakdown</h2>
                <p>See how your applications are distributed.</p>
              </div>
            </div>

            {[
              {
                label: "Applied",
                value: applications.filter((app) => app.status === "Applied")
                  .length,
              },
              { label: "Interview", value: interviews },
              { label: "Offered", value: offers },
              { label: "Rejected", value: rejected },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: "22px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </div>

                <div
                  style={{
                    height: "10px",
                    background: theme === "dark" ? "#334155" : "#e2e8f0",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${total ? (item.value / total) * 100 : 0}%`,
                      height: "100%",
                      background: "#8054c7",
                      borderRadius: "20px",
                    }}
                  />
                </div>
              </div>
            ))}
          </section>

          <section className="applications-section">
            <div className="section-heading">
              <div>
                <h2>Monthly Applications</h2>
                <p>Track your applications over the last 12 months.</p>
              </div>
            </div>

            <div style={{ width: "100%", height: "350px", marginTop: "20px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyApplications}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === "dark" ? "#334155" : "#e2e8f0"}
                  />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="applications"
                    name="Applications"
                    fill="#8054c7"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="applications-section">
            <div className="section-heading">
              <div>
                <h2>Application Status Distribution</h2>
                <p>See how your applications are split by status.</p>
              </div>
            </div>

            {total === 0 ? (
              <p className="empty-message">
                Add applications to see your status distribution.
              </p>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "350px",
                  marginTop: "20px",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      label
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index]} />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  // DASHBOARD PAGE
  return (
    <div className={`app ${theme}`}>
      <aside className="sidebar">
        <h2 className="logo">
          JobTrack<span>.</span>
        </h2>

        <p className="menu-label">MENU</p>

        <nav>
          <a className="nav-link active" href="#dashboard">
            ▦ Dashboard
          </a>

          <a className="nav-link" href="#applications">
            ▤ Applications
          </a>

          <a className="nav-link" href="#interviews">
            ◷ Interviews
          </a>

          <a
            className={`nav-link ${activePage === "analytics" ? "active" : ""}`}
            href="#analytics"
            onClick={(e) => {
              e.preventDefault();
              setActivePage("analytics");
            }}
          >
            ▥ Analytics
          </a>
        </nav>

        <div className="sidebar-bottom">
          <p className="menu-label">ACCOUNT</p>

          <button
            type="button"
            className="nav-link"
            onClick={() => setActivePage("settings")}
          >
            ⚙ Settings
          </button>

          <div className="user-profile">
            <div className="avatar">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{currentUser.name}</strong>
              <small>Job Seeker</small>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              marginTop: "15px",
              padding: "10px",
              width: "100%",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            Log Out
          </button>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Pages / Dashboard</p>
            <h1>Dashboard</h1>
          </div>

          <button className="profile-button" type="button">
            {currentUser.name.charAt(0).toUpperCase()}
          </button>
        </header>

        <section className="welcome">
          <div>
            <p>YOUR CAREER JOURNEY</p>
            <h2>Welcome back, {currentUser.name}! 👋</h2>
            <span>
              Keep going. Your next opportunity could be closer than you think.
            </span>
          </div>

          <button className="add-button" onClick={openAddForm}>
            + Add Application
          </button>
        </section>

        {error && <p style={{ color: "red", margin: "15px 0" }}>{error}</p>}

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Applications</span>
            <h2>{total}</h2>
            <small>All your job applications</small>
          </div>

          <div className="stat-card">
            <span>Interviews</span>
            <h2>{interviews}</h2>
            <small>Companies interested in you</small>
          </div>

          <div className="stat-card">
            <span>Offers</span>
            <h2>{offers}</h2>
            <small>Potential opportunities</small>
          </div>

          <div className="stat-card">
            <span>Rejected</span>
            <h2>{rejected}</h2>
            <small>Keep pushing forward</small>
          </div>
        </section>

        <section className="applications-section" id="interviews">
          <div className="section-heading">
            <div>
              <h2>Upcoming Interviews</h2>
              <p>Keep track of your scheduled interviews.</p>
            </div>

            <span>{upcomingInterviews.length} Scheduled</span>
          </div>

          {upcomingInterviews.length === 0 ? (
            <p className="empty-message">
              No upcoming interviews. When you schedule an interview, it will
              appear here.
            </p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>COMPANY</th>
                    <th>POSITION</th>
                    <th>INTERVIEW DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {upcomingInterviews.map((application) => (
                    <tr key={application._id}>
                      <td>
                        <strong>{application.company}</strong>
                      </td>

                      <td>{application.role}</td>

                      <td>{formatDate(application.interviewDate)}</td>

                      <td>
                        <span className="status purple">
                          {application.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(application)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="applications-section" id="applications">
          <div className="section-heading">
            <div>
              <h2>Recent Applications</h2>
              <p>Keep track of your latest job opportunities.</p>
            </div>

            <button
              className="view-button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
              }}
            >
              View all →
            </button>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="Search company or job position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Applications</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offered">Offered</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>COMPANY</th>
                  <th>POSITION</th>
                  <th>DATE APPLIED</th>
                  <th>INTERVIEW DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-message">
                      Loading applications...
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-message">
                      No applications yet. Click Add Application to get started.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application._id}>
                      <td>
                        <strong>{application.company}</strong>
                      </td>

                      <td>{application.role}</td>
                      <td>{formatDate(application.date)}</td>
                      <td>{formatDate(application.interviewDate)}</td>

                      <td>
                        <span
                          className={`status ${statusColors[application.status]}`}
                        >
                          {application.status}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(application)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => handleDelete(application._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {showForm && (
          <div className="modal-overlay">
            <form className="application-form" onSubmit={handleSubmit}>
              <div className="form-heading">
                <div>
                  <h2>{editingId ? "Edit Application" : "Add Application"}</h2>

                  <p>
                    {editingId
                      ? "Update your job application details."
                      : "Enter your job application details."}
                  </p>
                </div>

                <button
                  type="button"
                  className="close-button"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <label>Company Name</label>
              <input
                type="text"
                placeholder="e.g. Google"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />

              <label>Job Position</label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              />

              <label>Date Applied</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />

              <label>Interview Date (Optional)</label>
              <input
                type="date"
                value={form.interviewDate}
                onChange={(e) =>
                  setForm({ ...form, interviewDate: e.target.value })
                }
              />

              <label>Application Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offered">Offered</option>
              </select>

              <button type="submit" className="submit-button">
                {editingId ? "Save Changes" : "Save Application"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
