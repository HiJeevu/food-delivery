import React, { useState } from 'react';
import axios from 'axios';

export default function AddItem() {
    const [item, setItem] = useState({ name: '', price: '', description: '', image: null });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(item).forEach(key => formData.append(key, item[key]));
        
        await axios.post('https://697b6d025f4ef0af22ecfeee--curious-zabaione-43dba3.netlify.app/api/items', formData);
        alert("Item Added!");
        window.location.reload();
    };

    return (
        <div className="card p-3 shadow-sm">
            <h5>Add New Item</h5>
            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6"><input type="text" className="form-control" placeholder="Item Name" onChange={e => setItem({...item, name: e.target.value})} /></div>
                <div className="col-md-6"><input type="number" className="form-control" placeholder="Price" onChange={e => setItem({...item, price: e.target.value})} /></div>
                <div className="col-12"><textarea className="form-control" placeholder="Description" onChange={e => setItem({...item, description: e.target.value})} /></div>
                <div className="col-12"><input type="file" className="form-control" onChange={e => setItem({...item, image: e.target.files[0]})} /></div>
                <div className="col-12"><button type="submit" className="btn btn-primary">Save Item</button></div>
            </form>
        </div>
    );
}