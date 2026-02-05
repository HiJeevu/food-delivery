import React, { useState } from 'react';
import axios from 'axios';

export default function EditItem({ item, onUpdate, onCancel }) {
    const [formData, setFormData] = useState({ ...item });
    const [newImage, setNewImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        if (newImage) data.append('image', newImage);

        try {
            await axios.put(`http://localhost:5000/api/items/${item.id}`, data);
            alert("Item updated!");
            onUpdate(); // Refresh the list
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card p-4 shadow-sm mb-4 border-primary">
            <h5>Edit Item: {item.name}</h5>
            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Item Name</label>
                    <input type="text" className="form-control" value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Price ($)</label>
                    <input type="number" className="form-control" value={formData.price} 
                        onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Update Image (Optional)</label>
                    <input type="file" className="form-control" onChange={e => setNewImage(e.target.files[0])} />
                </div>
                <div className="col-12 d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}