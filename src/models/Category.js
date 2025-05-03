export class Category {
    constructor({ id, name, description }) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    get displayName() {
        return this.name.toUpperCase();
    }
}
