import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../styles/Post.module.css';
import {useLikeController} from "../../../controllers/LikeController.js";
import {LikeButton} from "./LikeButton.jsx";

const PostView = ({ post, currentUserId, onDelete}) => {

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
        fetchLikes();
    }, [post.id]);

    if (!post) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to={`/profile/${author?.id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <img
                            src={author?.avatar || '/default-avatar.png'}
                            alt="avatar"
                            className={styles.avatar}
                        />
                        <div style={{ marginLeft: '10px' }}>
                            <div className={styles.author}>{author?.username || 'Аноним'}</div>
                            <div className={styles.date}>{new Date(createDate).toLocaleString()}</div>
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
