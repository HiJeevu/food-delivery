import React, { useState } from 'react';
import axios from 'axios';

export default function AuthPage({ onLoginSuccess }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });

    const handleAuth = async (e) => {
        e.preventDefault();
        let url = isAdmin ? 'http://localhost:5000/api/admin/login' : 'http://localhost:5000/api/user/login';
        if (isRegister) url = 'http://localhost:5000/api/user/register';

        try {
            const res = await axios.post(url, form);
            if (res.data.success) {
                if (isRegister) {
                    alert("Registration successful! Please Login.");
                    setIsRegister(false);
                } else {
                    localStorage.setItem('session', JSON.stringify(res.data));
                    onLoginSuccess(res.data);
                }
            }
        } catch (err) {
            alert("Auth Failed: " + err.response.data.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                <div className="text-center mb-4">
                    <div className="btn-group w-100">
                        <button className={`btn btn-sm ${!isAdmin ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => {setIsAdmin(false); setIsRegister(false)}}>Customer</button>
                        <button className={`btn btn-sm ${isAdmin ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => {setIsAdmin(true); setIsRegister(false)}}>Admin</button>
                    </div>
                    <h3 className="mt-3">{isAdmin ? 'Admin Portal' : (isRegister ? 'Create Account' : 'Customer Login')}</h3>
                </div>

                <form onSubmit={handleAuth}>
                    {isRegister && (
                        <input type="text" placeholder="Full Name" className="form-control mb-2" required
                            onChange={e => setForm({...form, name: e.target.value})} />
                    )}
                    <input type={isAdmin ? "text" : "email"} placeholder={isAdmin ? "Username" : "Email"} className="form-control mb-2" required
                        onChange={e => isAdmin ? setForm({...form, username: e.target.value}) : setForm({...form, email: e.target.value})} />
                    
                    <input type="password" placeholder="Password" className="form-control mb-3" required
                        onChange={e => setForm({...form, password: e.target.value})} />
                    
                    <button className="btn btn-dark w-100 mb-2">{isRegister ? 'Register' : 'Login'}</button>
                </form>

                {!isAdmin && (
                    <button className="btn btn-link w-100" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? 'Already have an account? Login' : 'New customer? Register here'}
                    </button>
                )}
            </div>
        </div>
    );
}