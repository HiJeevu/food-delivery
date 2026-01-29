import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddItem from './components/AddItem';
import ItemList from './components/ItemList';
import OrderList from './components/OrderList';
import Login from './components/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [view, setView] = useState('items');

    // Check if user was already logged in (on refresh)
    useEffect(() => {
        const loggedIn = localStorage.getItem('isAdmin');
        if (loggedIn === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        setIsAuthenticated(false);
    };

    // If not logged in, show the Login screen
    if (!isAuthenticated) {
        return <Login setAuth={setIsAuthenticated} />;
    }

    // Dashboard View (only visible if isAuthenticated is true)
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <nav className="col-md-2 d-none d-md-block bg-dark sidebar min-vh-100 p-3 shadow">
                    <h4 className="text-white mb-4 border-bottom pb-2">Admin Panel</h4>
                    <button className={`btn w-100 mb-2 text-start ${view === 'items' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setView('items')}>
                        📦 Manage Items
                    </button>
                    <button className={`btn w-100 mb-4 text-start ${view === 'orders' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setView('orders')}>
                        🛒 Orders
                    </button>
                    <hr className="text-white" />
                    <button className="btn btn-danger w-100 mt-5" onClick={handleLogout}>
                        Logout
                    </button>
                </nav>

                {/* Main Content */}
                <main className="col-md-10 p-4 bg-light">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">{view === 'items' ? 'Product Management' : 'Order Management'}</h1>
                    </div>

                    {view === 'items' ? (
                        <>
                            <AddItem />
                            <ItemList />
                        </>
                    ) : (
                        <OrderList />
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;