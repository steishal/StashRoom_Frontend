import React, { useEffect, useState } from 'react';
import '../../../styles/Admin.css';
import {CategoryService} from "../../../services/categoryService.js";
import { useNavigate } from 'react-router-dom';

const CategoryAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [editName, setEditName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await CategoryService.getAllCategoriesForAdmin();
            setCategories(data);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                navigate('/home');
            } else {
                console.error('Ошибка при загрузке категорий:', error);
            }
        }
    };

    const handleCreate = async () => {
        if (!newCategoryName.trim()) return;
        await CategoryService.createCategory({ name: newCategoryName });
        setNewCategoryName('');
        fetchCategories();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить категорию?')) return;
        await CategoryService.deleteCategory(id);
        fetchCategories();
    };

    const handleEdit = async (id) => {
        await CategoryService.updateCategory(id, { name: editName });
        setEditMode(null);
        setEditName('');
        fetchCategories();
    };

    return (
        <div className="category-container">
            <h2>Управление категориями</h2>

            <div className="category-input-group">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Новая категория"
                />
                <button onClick={handleCreate}>Добавить</button>
            </div>

            <div className="category-grid">
                {categories.map((category) => (
                    <div className="category-card" key={category.categoryId}>
                        {editMode === category.categoryId ? (
                            <>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="edit-input"
                                />
                                <div className="button-group">
                                    <button className="btn save" onClick={() => handleEdit(category.categoryId)}>
                                        Сохранить
                                    </button>
                                    <button className="btn cancel" onClick={() => setEditMode(null)}>
                                        Отмена
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>{category.name}</h3>
                                <p className="category-id">ID: {category.categoryId}</p>
                                <div className="button-group">
                                    <button
                                        className="btn edit"
                                        onClick={() => {
                                            setEditMode(category.categoryId);
                                            setEditName(category.name);
                                        }}
                                    >
                                        Редактировать
                                    </button>
                                    <button className="btn delete" onClick={() => handleDelete(category.categoryId)}>
                                        Удалить
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryAdmin;

