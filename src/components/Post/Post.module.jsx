
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Post.module.css';

const PostModule = ({ post, currentUserId }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = async () => {
    // API call для лайка
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <Link to={`/profile/${post.authorId}`} className="post-author-name">
          {post.authorName}
        </Link>
        {currentUserId === post.authorId && (
          <div className="post-options">
            <button className="options-button">⋮</button>
            <div className="options-menu">
              <Link to={`/edit-post/${post.id}`}>Редактировать</Link>
              <button className="delete-button">Удалить</button>
            </div>
          </div>
        )}
      </div>
      <p className="post-create-date">{new Date(post.createdAt).toLocaleDateString()}</p>
      <div className="post-content">
        <pre>{post.content}</pre>
        {post.images?.map((img, index) => (
          <img key={index} src={img.url} className="post-image" alt="Пост" />
        ))}
      </div>
      <div className="post-actions">
        <button className="like-button" onClick={handleLike}>
          <i className={`fa-heart ${isLiked ? 'fas liked' : 'far'}`} />
          <span className="likes-count">{likesCount}</span>
        </button>
        <Link to={`/post/${post.id}/comments`} className="comment-button">
          <i className="far fa-comment" />
          <span className="comments-count">{post.commentsCount}</span>
        </Link>
      </div>
    </div>
  );
};

export default PostModule;
