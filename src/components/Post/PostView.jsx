import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Post.css';

const PostView = ({
                      post,
                      currentUserId,
                      onDelete,
                      onLike
                  }) => {
    return (
        <div className={styles.postContainer}>
            <div className={styles.postHeader}>
                <Link
                    to={`/profile/${post.author.id}`}
                    className={styles.postAuthor}
                >
                    <img
                        src={post.author.avatar}
                        alt="Аватар"
                        className={styles.authorAvatar}
                    />
                    <span className={styles.authorName}>
            {post.author.username}
          </span>
                </Link>

                {currentUserId === post.author.id && (
                    <div className={styles.postOptions}>
                        <Link
                            to={`/edit-post/${post.id}`}
                            className={styles.editButton}
                        >
                            <i className="fas fa-edit" />
                        </Link>
                        <button
                            onClick={onDelete}
                            className={styles.deleteButton}
                        >
                            <i className="fas fa-trash" />
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.postContent}>
                <p className={styles.postText}>{post.content}</p>
                <div className={styles.postMedia}>
                    {post.images?.map((img, index) => (
                        <img
                            key={index}
                            src={img.url}
                            alt={`Пост ${post.id}`}
                            className={styles.postImage}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.postFooter}>
                <div className={styles.postStats}>
          <span className={styles.postDate}>
            {new Date(post.createdAt).toLocaleDateString()}
          </span>

                    <button
                        onClick={onLike}
                        className={`${styles.likeButton} ${post.isLiked ? styles.liked : ''}`}
                    >
                        <i className={`${post.isLiked ? 'fas' : 'far'} fa-heart`} />
                        <span className={styles.likesCount}>
              {post.likeCount}
            </span>
                    </button>

                    <Link
                        to={`/post/${post.id}/comments`}
                        className={styles.commentsLink}
                    >
                        <i className="far fa-comment" />
                        <span className={styles.commentsCount}>
              {post.commentsCount}
            </span>
                    </Link>
                </div>

                {post.categories.length > 0 && (
                    <div className={styles.postCategories}>
                        {post.categories.map(category => (
                            <span
                                key={category.id}
                                className={styles.categoryTag}
                            >
                #{category.name}
              </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostView;