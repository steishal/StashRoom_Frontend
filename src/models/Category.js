export class Category {
    constructor({ id, name}) {
        this.id = id;
        this.name = name;
    }

    get displayName() {
        return this.name.toUpperCase();
    }
}
