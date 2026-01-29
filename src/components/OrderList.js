import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderList() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/orders').then(res => setOrders(res.data));
    }, []);

    const updateStatus = async (id, newStatus) => {
        await axios.put(`http://localhost:5000/api/orders/${id}`, { status: newStatus });
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const getBadgeClass = (status) => {
        if (status === 'Pending') return 'bg-warning';
        if (status === 'Delivered') return 'bg-success';
        return 'bg-info';
    };

    return (
        <div className="card p-3 shadow-sm">
            <h5>Recent Orders</h5>
            <table className="table table-hover mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.customer_name}</td>
                            <td>${order.total_amount}</td>
                            <td><span className={`badge ${getBadgeClass(order.status)}`}>{order.status}</span></td>
                            <td>
                                <select className="form-select form-select-sm" onChange={(e) => updateStatus(order.id, e.target.value)} value={order.status}>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}