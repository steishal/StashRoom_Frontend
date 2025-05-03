import { useState } from 'react';
import { CommentService } from '../services/commentService.js';
import { Comment } from '../models/Comment.js';

export const useCommentController = (postId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await CommentService.getCommentsByPost(postId);
            setComments(data.map(c => new Comment(c)));
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const addComment = async (content) => {
        setError(null);
        try {
            const newComment = await CommentService.createComment({
                postId,
                content
            });
            setComments(prev => [new Comment(newComment), ...prev]);
        } catch (e) {
            setError(e.message);
            throw e;
        }
    };

    const updateComment = async (commentId, newContent) => {
        setError(null);
        try {
            const updatedComment = await CommentService.updateComment({
                id: commentId,
                content: newContent
            });
            setComments(prev =>
                prev.map(c => c.id === commentId ? new Comment(updatedComment) : c)
            );
        } catch (e) {
            setError(e.message);
            throw e;
        }
    };

    const deleteComment = async (commentId) => {
        setError(null);
        try {
            await CommentService.deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (e) {
            setError(e.message);
            throw e;
        }
    };

    return {
        comments,
        loading,
        error,
        fetchComments,
        addComment,
        updateComment,
        deleteComment
    };
};
