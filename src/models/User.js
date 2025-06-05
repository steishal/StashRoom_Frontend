export class User {
    constructor({ id, username, email, createdAt, avatar }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.createdAt = new Date(createdAt);
        this.avatar = avatar || null;
    }
    static fromJSON(json) {
        return new User(json);
    }
}
