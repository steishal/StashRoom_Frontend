import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../styles/Post.module.css';

const PostView = ({
                      post,
                      currentUserId,
                      onDelete,
                      onLike
                  }) => {
    if (!post) return null;

    const {
        author,
        images,
        content,
        createDate,
        likeCount,
        likedByCurrentUser,
        commentsCount,
        category
    } = post;

    return (
        <div className={styles.postContainer}>
            <div className={styles.postHeader}>
                <Link to={`/profile/${author?.id}`} className={styles.postAuthor}>
                    {author?.avatar && (
                        <img
                            src={author.avatar || '/default-avatar.png'}
                            alt="Аватар"
                            className={styles.authorAvatar}
                        />
                    )}
                    <span className={styles.authorName}>
            {author?.username || 'Неизвестный автор'}
          </span>
                </Link>

                {currentUserId === author?.id && (
                    <div className={styles.postOptions}>
                        <Link to={`/edit-post/${post.id}`} className={styles.editButton}>
                            <i className="fas fa-edit" />
                        </Link>
                        <button onClick={onDelete} className={styles.deleteButton}>
                            <i className="fas fa-trash" />
                        </button>
                    </div>
                )}
            </div>

            {Array.isArray(images) && images.length > 0 && (
                <div className="post-images">
                    {images.map((url, index) =>
                        url ? (
                            <img
                                key={index}
                                src={url}
                                alt={`Post image ${index + 1}`}
                                className="post-image"
                                style={{ maxWidth: '100%', marginBottom: '8px' }}
                            />
                        ) : null
                    )}
                </div>
            )}

            {content && <p className={styles.postContent}>{content}</p>}

            <div className={styles.postFooter}>
                <div className={styles.postStats}>
          <span className={styles.postDate}>
            {createDate ? new Date(createDate).toLocaleDateString() : 'Дата не указана'}
          </span>

                    <button
                        onClick={onLike}
                        className={`${styles.likeButton} ${likedByCurrentUser ? styles.liked : ''}`}
                    >
                        <i className={`${likedByCurrentUser ? 'fas' : 'far'} fa-heart`} />
                        <span className={styles.likesCount}>{likeCount ?? 0}</span>
                    </button>

                    <Link to={`/post/${post.id}/comments`} className={styles.commentsLink}>
                        <i className="far fa-comment" />
                        <span className={styles.commentsCount}>{commentsCount ?? 0}</span>
                    </Link>
                </div>

                {category && (
                    <div className={styles.postCategories}>
                        <span className={styles.categoryTag}>#{category.name}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostView;
