export class User {
    constructor({ id, username, email, phoneNumber, vkLink, tgLink, createdAt, avatar }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber || '';
        this.vkLink = vkLink || '';
        this.tgLink = tgLink || '';
        this.createdAt = new Date(createdAt);
        this.avatar = avatar || null;
    }

    static fromJSON(json) {
        return new User(json);
    }
}
