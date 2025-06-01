export class Message {
    constructor({ id, content, sender, receiver, createdAt, reactions = [],
                    attachments = [], format = 'plain'  }) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.receiver = receiver;
        this.createdAt = new Date(createdAt);
        this.reactions = reactions;
        this.attachments = attachments;
        this.format = format;
    }
}
