import { Category } from "./Category.js";

export class Post {
    constructor(data = {}) {
        const {
            id = null,
            content = '',
            author = {},
            category = null,
            createDate = null,
            images = [],
            likeCount = 0,
            likedByCurrentUser = false,
            commentsCount = 0
        } = data;

        this.id = id;
        this.content = content;
        this.author = {
            id: author.id ?? null,
            username: author.username ?? '',
            avatar: author.avatar ?? ''
        };
        this.category = category ? new Category(category) : null;
        this.createDate = createDate;
        this.images = images;
        this.likeCount = likeCount;
        this.likedByCurrentUser = likedByCurrentUser;
        this.commentsCount = commentsCount;
    }
}
