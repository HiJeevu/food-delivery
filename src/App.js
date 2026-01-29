import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './AdminDashboard'; 
import UserStore from './components/UserStore';

function App() {
    // This state simulates switching between the Customer site and Admin site
    const [mode, setMode] = useState('user'); 

    return (
        <div>
            {/* Simple Switcher Bar (For development purposes) */}
            <div className="bg-secondary p-2 d-flex justify-content-center">
                <span className="text-white me-3 align-self-center">View Mode:</span>
                <div className="btn-group" role="group">
                    <button 
                        className={`btn btn-sm ${mode === 'user' ? 'btn-light' : 'btn-outline-light'}`} 
                        onClick={() => setMode('user')}
                    >
                        Customer Storefront
                    </button>
                    <button 
                        className={`btn btn-sm ${mode === 'admin' ? 'btn-light' : 'btn-outline-light'}`} 
                        onClick={() => setMode('admin')}
                    >
                        Admin Dashboard
                    </button>
                </div>
            </div>

            {/* Conditional Rendering */}
            {mode === 'admin' ? (
                <AdminDashboard /> 
            ) : (
                <UserStore />
            )}
        </div>
    );
}

export default App;