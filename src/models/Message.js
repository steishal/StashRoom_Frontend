export class Message {
    constructor({ id, content, sender, receiver, createdAt }) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.receiver = receiver;
        this.createdAt = new Date(createdAt);
    }

    get timeAgo() {
        const now = new Date();
        const diffSeconds = Math.floor((now - this.createdAt) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, seconds] of Object.entries(intervals)) {
            const interval = Math.floor(diffSeconds / seconds);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }

        return 'Just now';
    }
}
