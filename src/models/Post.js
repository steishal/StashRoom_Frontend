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
        this.commentsCount = data.commentsCount
    }
}
