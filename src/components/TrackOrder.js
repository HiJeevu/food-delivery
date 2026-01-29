import React, { useState } from 'react';
import axios from 'axios';

export default function TrackOrder() {
    const [orderId, setOrderId] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId) return;
        setLoading(true);
        try {
            const res = await axios.get(`https://697b6d025f4ef0af22ecfeee--curious-zabaione-43dba3.netlify.app/api/orders/track/${orderId}`);
            setOrderData(res.data);
        } catch (err) {
            alert("Order ID not found. Please check your ID.");
            setOrderData(null);
        }
        setLoading(false);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-4 text-center">
                            <h3 className="mb-4">Track Your Order</h3>
                            <form onSubmit={handleTrack}>
                                <div className="input-group mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg" 
                                        placeholder="Enter Order ID (e.g. 101)" 
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                    />
                                    <button className="btn btn-primary px-4" type="submit">
                                        {loading ? 'Searching...' : 'Track'}
                                    </button>
                                </div>
                            </form>

                            {orderData && (
                                <div className="mt-5 text-start border-top pt-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Order Status</h5>
                                        <span className={`badge p-2 fs-6 ${
                                            orderData.status === 'Delivered' ? 'bg-success' : 'bg-primary'
                                        }`}>
                                            {orderData.status}
                                        </span>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Order ID:</span> <strong>#{orderData.id}</strong>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Placed On:</span> <strong>{new Date(orderData.order_date).toLocaleDateString()}</strong>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Customer Name:</span> <strong>{orderData.customer_name}</strong>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Total Amount:</span> <strong>${orderData.total_amount}</strong>
                                        </li>
                                    </ul>
                                    
                                    {/* Visual Status Bar */}
                                    <div className="mt-4 px-2">
                                        <div className="progress" style={{ height: '10px' }}>
                                            <div 
                                                className="progress-bar progress-bar-striped progress-bar-animated" 
                                                role="progressbar" 
                                                style={{ 
                                                    width: orderData.status === 'Pending' ? '25%' : 
                                                           orderData.status === 'Processing' ? '50%' : 
                                                           orderData.status === 'Shipped' ? '75%' : '100%' 
                                                }}
                                            ></div>
                                        </div>
                                        <div className="d-flex justify-content-between mt-2 small text-muted">
                                            <span>Order Placed</span>
                                            <span>Processing</span>
                                            <span>On the way</span>
                                            <span>Delivered</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}