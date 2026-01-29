import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setAuth }) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('bymjtenlroh3v4n2pyhv-mysql.services.clever-cloud.com/api/login', credentials);
            if (res.data.success) {
                localStorage.setItem('isAdmin', 'true'); // Simple session persistence
                setAuth(true);
            }
        } catch (err) {
            setError('Invalid Username or Password');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ width: '350px' }}>
                <h3 className="text-center mb-4">Admin Login</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}