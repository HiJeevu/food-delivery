import React, { useState } from 'react';
import AddItem from './components/AddItem';
import ItemList from './components/ItemList';
import OrderList from './components/OrderList';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('items');

    return (
        <div className="container-fluid">
            <div className="row">
                {/* SIDEBAR */}
                <nav className="col-md-2 d-none d-md-block bg-dark sidebar min-vh-100 p-0 shadow">
                    <div className="p-3 text-white border-bottom border-secondary text-center">
                        <h5 className="mb-0">Admin Panel</h5>
                    </div>
                    <ul className="nav flex-column mt-3">
                        <li className="nav-item px-3 mb-2">
                            <button 
                                className={`btn w-100 text-start ${activeTab === 'items' ? 'btn-primary' : 'btn-outline-light'}`}
                                onClick={() => setActiveTab('items')}
                            >
                                📦 Manage Inventory
                            </button>
                        </li>
                        <li className="nav-item px-3 mb-2">
                            <button 
                                className={`btn w-100 text-start ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline-light'}`}
                                onClick={() => setActiveTab('orders')}
                            >
                                🛒 Customer Orders
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* MAIN CONTENT AREA */}
                <main className="col-md-10 ms-sm-auto px-md-4 bg-light">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">{activeTab === 'items' ? 'Inventory Management' : 'Order Tracking'}</h1>
                    </div>

                    {activeTab === 'items' ? (
                        <div className="row">
                            <div className="col-md-4">
                                <AddItem />
                            </div>
                            <div className="col-md-8">
                                <ItemList />
                            </div>
                        </div>
                    ) : (
                        <OrderList />
                    )}
                </main>
            </div>
        </div>
    );
}