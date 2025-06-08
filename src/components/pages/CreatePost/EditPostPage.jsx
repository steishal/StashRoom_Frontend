import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../../styles/CreatePostPage.module.css';
import { usePostController } from '../../../controllers/PostController.js';
import apiClient from "../../../apiClient.js";


const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { post, fetchPostById, updatePost } = usePostController();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchPostById(id);
            try {
                const response = await apiClient.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (post) {
            setContent(post.content);
            setCategoryId(post.categoryId);
            setExistingImages(post.imageUrls || []);
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!categoryId) {
            alert("Выберите категорию");
            setIsSubmitting(false);
            return;
        }

        try {
            await updatePost(id, { content, categoryId });
            alert('Пост обновлён!');
            navigate('/home');
        } catch (err) {
            console.error('Ошибка при обновлении поста', err);
            alert('Не удалось обновить пост');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Редактировать пост</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.selectWrapper}>
                    <div className={styles.categories}>
                        {categories.map(cat => (
                            <button
                                type="button"
                                key={cat.categoryId}
                                onClick={() => setCategoryId(cat.categoryId)}
                                className={`${styles.categoryCard} ${categoryId === cat.categoryId ? styles.selected : ''}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
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

                <button type="submit" className={styles.button} disabled={isSubmitting}>
                    {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </button>
            </form>
        </div>
    );
};

export default EditPostPage;
