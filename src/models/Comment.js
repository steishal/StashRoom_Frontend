export class Comment {
    constructor({ id, content, authorUsername, authorId, postId, createDate }) {
        this.id = id;
        this.content = content;
        this.author = {
            username: authorUsername,
            avatar: null,
            id: authorId
        };
        this.postId = postId;
        this.createdAt = new Date(createDate);
    }
}
