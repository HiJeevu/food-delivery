import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ItemList() {
    const [items, setItems] = useState([]);

    // Fetch items from the backend
    const fetchItems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/items');
            setItems(res.data);
        } catch (err) {
            console.error("Error fetching items", err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Delete item function
    const deleteItem = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`http://localhost:5000/api/items/${id}`);
                setItems(items.filter(item => item.id !== id));
            } catch (err) {
                alert("Error deleting item");
            }
        }
    };

    return (
        <div className="card p-3 shadow-sm mt-4">
            <h5>Manage Items</h5>
            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <img 
                                        src={`http://localhost:5000/uploads/${item.image}`} 
                                        alt={item.name} 
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} 
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td>${item.price}</td>
                                <td><small className="text-muted">{item.description}</small></td>
                                <td>
                                    <button 
                                        className="btn btn-danger btn-sm" 
                                        onClick={() => deleteItem(item.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center">No items found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}