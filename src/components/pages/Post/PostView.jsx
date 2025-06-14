import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../styles/Post.module.css';
import {useLikeController} from "../../../controllers/LikeController.js";
import {LikeButton} from "./LikeButton.jsx";
import {useUserController} from "../../../controllers/UserController.js";
import { ru } from 'date-fns/locale';
import {formatDistanceToNow} from "date-fns";

const PostView = ({ post, currentUserId, onDelete}) => {

    const [avatarUrl, setAvatarUrl] = useState(null);
    const {
        fetchUserAvatar
    } = useUserController();

    const {
        author,
        images,
        content,
        createDate,
        commentsCount,
        category
    } = post;

    const {
        likes,
        isLiked,
        handleLike,
        fetchLikes
    } = useLikeController(post.id);

    useEffect(() => {
        const loadAvatar = async () => {
            try {
                const avatar = await fetchUserAvatar(author.id);
                setAvatarUrl(avatar);
            } catch (err) {
                console.error("Ошибка при загрузке аватара:", err);
            }
        };

        if (author.id) {
            loadAvatar();
        }
        fetchLikes();
    }, [post.id, author.id]);

    if (!post) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to={`/profile/${author?.id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <img
                            src={avatarUrl || '/default-avatar.png'}
                            alt="avatar"
                            className={styles.avatar}
                        />
                        <div style={{ marginLeft: '10px' }}>
                            <div className={styles.author}>{author?.username || 'Аноним'}</div>
                            <div className={styles.date}>
                                {formatDistanceToNow(new Date(post.createDate), { addSuffix: true, locale: ru })}
                            </div>
                        </div>
                    </Link>
                </div>

                {currentUserId === author?.id && (
                    <div>
                        <Link to={`/posts/${post.id}/edit`} className={styles.actionBtn}>
                        <i className="fas fa-edit" />
                        </Link>
                        <button onClick={onDelete} className={styles.actionBtn}>
                            <i className="fas fa-trash" />
                        </button>
                    </div>
                )}
            </div>

            {content && <div className={styles.content}>{content}</div>}

            {images?.length > 0 && (
                <div className={styles.imageBlock}>
                    {images.map((img, idx) => (
                        <img key={idx} src={img} alt={`post-img-${idx}`} className={styles.image} />
                    ))}
                </div>
            )}

            <div className={styles.actions}>
                <LikeButton
                    isLiked={isLiked}
                    onClick={handleLike}
                    count={likes.length}
                />

                <Link to={`/post/${post.id}/comments`} className={styles.commentLink}>
                    <i className="far fa-comment" />
                    <span>{commentsCount ?? 0}</span>
                </Link>

                {category && (
                    <span className={styles.categoryTag}>#{category.name}</span>
                )}
            </div>
        </div>
    );
};

export default PostView;
