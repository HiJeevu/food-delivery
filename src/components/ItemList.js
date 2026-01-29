import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditItem from './EditItem';

export default function ItemList() {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    const fetchItems = async () => {
        const res = await axios.get('https://697b6d025f4ef0af22ecfeee--curious-zabaione-43dba3.netlify.app/api/items');
        setItems(res.data);
    };

    useEffect(() => { fetchItems(); }, []);

    const deleteItem = async (id) => {
        if (window.confirm("Delete this item?")) {
            await axios.delete(`https://697b6d025f4ef0af22ecfeee--curious-zabaione-43dba3.netlify.app/api/items/${id}`);
            fetchItems();
        }
    };

    return (
        <div className="mt-4">
            {/* If an item is being edited, show the Edit Form at the top */}
            {editingItem && (
                <EditItem 
                    item={editingItem} 
                    onUpdate={() => { setEditingItem(null); fetchItems(); }} 
                    onCancel={() => setEditingItem(null)} 
                />
            )}

            <div className="card p-3 shadow-sm">
                <h5>Product Inventory</h5>
                <table className="table align-middle">
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
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <img src={`https://697b6d025f4ef0af22ecfeee--curious-zabaione-43dba3.netlify.app/uploads/${item.image}`} 
                                         alt="" style={{width: '50px', borderRadius: '5px'}} />
                                </td>
                                <td>{item.name}</td>
                                <td>${item.price}</td>
                                <td className="text-truncate" style={{maxWidth: '200px'}}>{item.description}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-2" 
                                        onClick={() => setEditingItem(item)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" 
                                        onClick={() => deleteItem(item.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}