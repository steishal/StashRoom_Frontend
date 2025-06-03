import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePostController } from '../../../controllers/PostController';
import apiClient from '../../../apiClient';
import styles from '../../../styles/CreatePostPage.module.css';

const EditPostPage = () => {
    const { updatePost } = usePostController();
    const { id } = useParams();
    const navigate = useNavigate();

    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/posts/${id}`);
                const post = response.data;
                setContent(post.content);
                setCategoryId(post.categoryId);
                setExistingImages(post.imageUrls || []);
            } catch (err) {
                console.error('Ошибка загрузки поста:', err);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
            }
        };

        fetchPost();
        fetchCategories();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryId) {
            alert("Выберите категорию");
            return;
        }

        const postData = {
            content,
            categoryId
        };

        try {
            await updatePost(id, postData);
            alert('Пост обновлён!');
            navigate(`/posts/${id}`);
        } catch (err) {
            console.error('Ошибка при обновлении поста', err);
            alert('Не удалось обновить пост');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Редактировать пост</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.selectWrapper}>
                    <label htmlFor="category">Категория:</label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        className={styles.select}
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <textarea
                    className={styles.textarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Что у вас нового?"
                />

                {existingImages.length > 0 && (
                    <div className={styles.previewContainer}>
                        {existingImages.map((url, i) => (
                            <img key={i} src={url} alt={`img-${i}`} className={styles.previewImage} />
                        ))}
                        <p style={{ fontSize: '12px', color: '#777' }}>
                            Изображения нельзя изменить
                        </p>
                    </div>
                )}

                <button type="submit" className={styles.button}>Сохранить</button>
            </form>
        </div>
    );
};

export default EditPostPage;
