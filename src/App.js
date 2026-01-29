import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthPage from './components/AuthPage';
import AdminDashboard from './AdminDashboard';
import UserStore from './components/UserStore';

function App() {
    const [session, setSession] = useState(null);

    // 1. Check if user is already logged in on page load
    useEffect(() => {
        const savedSession = localStorage.getItem('session');
        if (savedSession) {
            setSession(JSON.parse(savedSession));
        }
    }, []);

    // 2. Function to call when login is successful
    const handleLoginSuccess = (data) => {
        setSession(data); // This triggers the re-render to Dashboard
    };

    const handleLogout = () => {
        localStorage.removeItem('session');
        setSession(null);
    };

    // 3. Conditional Rendering (The "Redirect" Logic)
    if (!session) {
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-vh-100 bg-light">
            {/* Header / Logout Bar */}
            <nav className="navbar navbar-dark bg-dark px-4">
                <span className="navbar-brand">
                    Welcome, {session.role === 'admin' ? 'Admin' : session.user.full_name || session.user.username}
                </span>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
            </nav>

            {/* Show Dashboard based on Role */}
            {session.role === 'admin' ? (
                <AdminDashboard />
            ) : (
                <UserStore user={session.user} />
            )}
        </div>
    );
}

export default App;