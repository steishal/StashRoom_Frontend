// core/models/User.js
export class User {
    constructor({ id, username, email, createdAt }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.createdAt = new Date(createdAt);
    }

    get profileUrl() {
        return `/users/${this.username}`;
    }

    static fromJSON(json) {
        return new User(json);
    }
}