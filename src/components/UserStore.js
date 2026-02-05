import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrackOrder from './TrackOrder'; // Import the tracking component

export default function UserStore() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [step, setStep] = useState('shop'); // shop, cart, checkout, success, track
    const [placedOrderId, setPlacedOrderId] = useState(null);

    // Delivery Info State
    const [delivery, setDelivery] = useState({ name: '', address: '', phone: '' });

    useEffect(() => {
        axios.get('http://localhost:5000/api/items').then(res => setProducts(res.data));
    }, []);

    const addToCart = (product) => {
        const exist = cart.find(x => x.id === product.id);
        if (exist) {
            setCart(cart.map(x => x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item =>
            item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        ));
    };

    const removeFromCart = (id) => setCart(cart.filter(x => x.id !== id));

    const totalPrice = cart.reduce((a, c) => a + c.price * c.qty, 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/orders', {
                customer_name: delivery.name,
                address: delivery.address,
                phone: delivery.phone,
                total_amount: totalPrice,
                cart: cart // Sending the actual cart array here
            });
            setPlacedOrderId(res.data.orderId);
            setStep('success');
            setCart([]); // Clear cart AFTER order is saved
        } catch (err) {
            alert("Checkout failed");
        }
    };

    // Function to start a new order session
    const continueShopping = () => {
        setPlacedOrderId(null);
        setStep('shop');
    };

    return (
        <div className="container mt-4">
            {/* User Navigation */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 px-3 rounded border">
                <span className="navbar-brand fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={continueShopping}>
                    🚀 My Shop
                </span>
                <div className="ms-auto d-flex align-items-center">
                    <button className="btn btn-link text-decoration-none me-3" onClick={() => setStep('track')}>Track Order</button>
                    <button className="btn btn-outline-primary position-relative" onClick={() => setStep('cart')}>
                        🛒 Cart
                        {cart.length > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            {/* Success View (The "Continue" Logic) */}
            {step === 'success' && (
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="card shadow-lg p-5 border-0">
                            <div className="display-1 text-success mb-3">🎉</div>
                            <h2 className="fw-bold">Order Received!</h2>
                            <p className="text-muted">Your order ID is <strong>#{placedOrderId}</strong></p>
                            <div className="alert alert-info">
                                You can use this ID in the <strong>Track Order</strong> section to check the status (Preparing, Shipped, etc.)
                            </div>
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary btn-lg" onClick={continueShopping}>
                                    Place Another Order
                                </button>
                                <button className="btn btn-outline-secondary" onClick={() => setStep('track')}>
                                    Track This Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Shop View */}
            {step === 'shop' && (
                <div className="row">
                    <div className="col-12 mb-4"><h3>Our Products</h3></div>
                    {products.map(p => (
                        <div className="col-md-4 col-sm-6 mb-4" key={p.id}>
                            <div className="card h-100 border-0 shadow-sm hover-shadow">
                                <img src={`http://localhost:5000/uploads/${p.image}`} className="card-img-top" alt={p.name} style={{ height: '180px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text text-muted small">{p.description}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="h5 mb-0 text-primary">${p.price}</span>
                                        <button className="btn btn-sm btn-dark" onClick={() => addToCart(p)}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Track Order View */}
            {step === 'track' && <TrackOrder />}

            {/* Cart View */}
            {step === 'cart' && (
                <div className="card border-0 shadow-sm p-4">
                    <h3>Shopping Cart</h3>
                    {cart.length === 0 ? (
                        <div className="text-center py-5">
                            <p>Your cart is empty.</p>
                            <button className="btn btn-primary" onClick={() => setStep('shop')}>Go Shopping</button>
                        </div>
                    ) : (
                        <>
                            <table className="table">
                                <thead>
                                    <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {cart.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>
                                                <button className="btn btn-sm btn-light border" onClick={() => updateQty(item.id, -1)}>-</button>
                                                <span className="mx-2">{item.qty}</span>
                                                <button className="btn btn-sm btn-light border" onClick={() => updateQty(item.id, 1)}>+</button>
                                            </td>
                                            <td>${item.price}</td>
                                            <td>${(item.price * item.qty).toFixed(2)}</td>
                                            <td><button className="btn btn-sm btn-link text-danger" onClick={() => removeFromCart(item.id)}>Remove</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="text-end mt-3">
                                <h4>Total: ${totalPrice.toFixed(2)}</h4>
                                <button className="btn btn-success btn-lg px-5 mt-2" onClick={() => setStep('checkout')}>Checkout</button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Checkout View */}
            {step === 'checkout' && (
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-sm p-4">
                            <h4>Delivery Details</h4>
                            <form onSubmit={handleCheckout}>
                                <div className="mb-3">
                                    <label>Full Name</label>
                                    <input type="text" className="form-control" value={delivery.name} onChange={e => setDelivery({ ...delivery, name: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label>Phone</label>
                                    <input type="text" className="form-control" value={delivery.phone} onChange={e => setDelivery({ ...delivery, phone: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label>Address</label>
                                    <textarea className="form-control" value={delivery.address} onChange={e => setDelivery({ ...delivery, address: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2">Confirm Order - ${totalPrice.toFixed(2)}</button>
                                <button type="button" className="btn btn-link w-100 mt-2" onClick={() => setStep('cart')}>Back to Cart</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}