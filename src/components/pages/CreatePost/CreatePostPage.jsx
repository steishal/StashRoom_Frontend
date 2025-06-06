import React, { useEffect, useState } from 'react';
import { usePostController } from '../../../controllers/PostController';
import apiClient from '../../../apiClient';
import styles from '../../../styles/CreatePostPage.module.css';
import {useNavigate} from "react-router-dom";

const CreatePostPage = () => {
    const { createPost } = usePostController();
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await apiClient.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Ошибка загрузки категорий', error);
            }
        };
        loadCategories();
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        setImages(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!categoryId) {
            alert("Выберите категорию");
            return;
        }

        const formData = new FormData();
        formData.append('content', content);
        formData.append('categoryId', 1);
        console.log(categoryId.id);
        images.forEach(img => formData.append('images', img));

        try {
            await createPost(formData);
            setContent('');
            setCategoryId('');
            setImages([]);
            setPreviewUrls([]);
            alert('Пост опубликован!');
            navigate('/home');
        } catch (err) {
            alert('Ошибка при публикации');
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Создать пост</h2>
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

                <div className={styles.imageUpload}>
                    <label className={styles.imageLabel}>
                        📷 Прикрепить фото
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            hidden
                        />
                    </label>

                    <div className={styles.previewContainer}>
                        {previewUrls.map((url, i) => (
                            <img key={i} src={url} alt={`preview-${i}`} className={styles.previewImage} />
                        ))}
                    </div>
                </div>

                <button type="submit" className={styles.button} disabled={isSubmitting}>
                    {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                </button>
            </form>
        </div>
    );
};

export default CreatePostPage;
