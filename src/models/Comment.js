export class Comment {
    constructor({ id, content, author, postId, createdAt }) {
        this.id = id;
        this.content = content;
        this.author = author;
        this.postId = postId;
        this.createdAt = new Date(createdAt);
    }

    get shortContent() {
        return this.content.slice(0, 50) + (this.content.length > 50 ? '...' : '');
    }
}
