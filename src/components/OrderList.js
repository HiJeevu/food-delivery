import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderList() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders", err);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}`, { status: newStatus });
            // Update local state to reflect change immediately
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            alert(`Order #${id} updated to ${newStatus}`);
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-warning text-dark';
            case 'Processing': return 'bg-info text-white';
            case 'Shipped': return 'bg-primary text-white';
            case 'Delivered': return 'bg-success text-white';
            case 'Cancelled': return 'bg-danger text-white';
            default: return 'bg-secondary text-white';
        }
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
                <h5 className="mb-0">Incoming Orders</h5>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Contact & Address</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td><span className="fw-bold">#{order.id}</span></td>
                                <td>{order.customer_name}</td>
                                <td>
                                    <small>
                                        {order.phone} <br />
                                        <span className="text-muted">{order.address}</span>
                                    </small>
                                </td>
                                <td>${order.total_amount}</td>
                                <td>
                                    <span className={`badge ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        className="form-select form-select-sm" 
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}