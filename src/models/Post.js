import {Like} from "./Like.js";
import {Category} from "./Category.js";

export class Post {
    constructor({ id, title, content, author, categories, likes, comments }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.categories = categories.map(c => new Category(c));
        this.likes = likes.map(l => new Like(l));
        this.comments = comments.map(c => new Comment(c));
    }

    get likeCount() {
        return this.likes.length;
    }
}
