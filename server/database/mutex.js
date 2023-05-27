
class mutex {

    constructor() {
        this.locked = false;
        this.queue = [];
    }
    acquire() {
        return new Promise((resolve) => {
            if (!this.locked) {
                this.locked = true;
                resolve();
            }else {
                this.queue.push(resolve);
            }
        });
    }

    release() {
        if (this.queue.length > 0) {
            const nextResolver = this.queue.shift();
            nextResolver();
        }else {
            this.locked = false;
        }
    }
}

module.exports = mutex;