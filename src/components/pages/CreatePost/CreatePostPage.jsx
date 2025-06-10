import React, { useEffect, useState } from 'react';
import { usePostController } from '../../../controllers/PostController';
import styles from '../../../styles/CreatePostPage.module.css';
import {useNavigate} from "react-router-dom";
import {CategoryService} from "../../../services/categoryService.js";

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
                const data = await CategoryService.getAllCategories();
                setCategories(data);
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
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('content', content);
        formData.append('categoryId', categoryId); // <-- исправлено
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Создать пост</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.selectWrapper}>
                    <div className={styles.categoryWrapper}>
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
