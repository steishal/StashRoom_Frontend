import {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../styles/PostCommentsPage.module.css';
import {useCommentController} from "../../../controllers/CommentController.js";
import {PostService} from "../../../services/postService.js";
import PostView from "../Post/PostView.jsx";
import {AuthContext} from "../../../context/AuthContext.jsx";
import {useUserController} from "../../../controllers/UserController.js";


const PostCommentsPage = () => {
    const { postId } = useParams();
    const [activeMenuId, setActiveMenuId] = useState(null);
    const toggleMenu = (commentId) => {
        setActiveMenuId(prev => prev === commentId ? null : commentId);
    };
    const { fetchUserAvatar } = useUserController();
    const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
    const { user } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        comments,
        fetchComments,
        addComment,
        updateComment,
        deleteComment
    } = useCommentController(postId);

    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarMap, setAvatarMap] = useState({});

    useEffect(() => {
        const fetchPost = async () => {
            const data = await PostService.getPostById(postId);
            setPost(data);
        };

        fetchPost();
        fetchComments();
    }, [postId]);

    useEffect(() => {
        const loadCurrentUserAvatar = async () => {
            if (user?.id) {
                const avatar = await fetchUserAvatar(user.id);
                setCurrentUserAvatar(avatar);
            }
        };
        loadCurrentUserAvatar();
    }, [user]);

    useEffect(() => {
        const loadAvatars = async () => {
            const map = {};
            for (const comment of comments) {
                const userId = comment.author?.id;
                if (userId && !avatarMap[userId]) {
                    const avatar = await fetchUserAvatar(userId);
                    map[userId] = avatar;
                }
            }
            setAvatarMap(prev => ({ ...prev, ...map }));
        };

        if (comments.length > 0) {
            loadAvatars();
        }
    }, [comments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting || !newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(newComment.trim());
            setNewComment('');
        } catch (err) {
            console.error('Ошибка при добавлении комментария:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (id) => {
        if (editContent.trim()) {
            await updateComment(id, editContent.trim());
            setEditingId(null);
        }
    };

    if (!post) return <div>Загрузка...</div>;

    return (
        <div className={styles.container}>

            <PostView post={post} currentUserId={user?.id} />

            <h3>Комментарии</h3>

            <form onSubmit={handleSubmit} className={styles.commentForm}>
                <img
                    src={currentUserAvatar || '/default-avatar.png'}
                    alt="avatar"
                    className={styles.commentAvatar}
                />
                <div className={styles.commentInputBlock}>
    <textarea
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        placeholder="Напишите комментарий..."
        className={styles.commentTextarea}
    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Отправка...' : 'Отправить'}
                    </button>
                </div>
            </form>
            <div className={styles.commentList}>
                {comments.map(comment => (
                    <div key={comment.id} className={styles.commentItem}>
                        <img
                            src={avatarMap[comment.author?.id] || '/default-avatar.png'}
                            alt="avatar"
                            className={styles.commentAvatar}
                        />
                        <div className={styles.commentContent}>
                            <div className={styles.commentHeader}>
                                <span className={styles.commentAuthor}>{comment.author?.username || 'Аноним'}</span>
                                <span>{comment.author?.id === user?.id && (
                                    <div className={styles.commentActionsWrapper}>
                                        <button
                                            className={styles.commentMenuButton}
                                            onClick={() => toggleMenu(comment.id)}
                                        >
                                            ⋯
                                        </button>
                                        {activeMenuId === comment.id && (
                                            <div className={styles.commentMenu}>
                                                <button onClick={() => {
                                                    setEditingId(comment.id);
                                                    setEditContent(comment.content);
                                                    setActiveMenuId(null);
                                                }}>Редактировать</button>
                                                <button onClick={() => {
                                                    deleteComment(comment.id);
                                                    setActiveMenuId(null);
                                                }}>Удалить</button>
                                            </div>
                                        )}
                                    </div>
                                )}</span>
                            </div>

                            {editingId === comment.id ? (
                                <>
            <textarea
                className={styles.commentTextarea}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
            />
                                    <div className={styles.commentActions}>
                                        <button onClick={() => handleUpdate(comment.id)}>Сохранить</button>
                                        <button onClick={() => setEditingId(null)}>Отмена</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.commentText}>{comment.content}</div>
                                    <span className={styles.commentDate}>{new Date(comment.createdAt).toLocaleString()}</span>

                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostCommentsPage;

