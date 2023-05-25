function NotImplementedException() {
    this.name = "NotImplementedError";
    this.message = "This feature is not implemented yet.";
    this.stack = (new Error()).stack;
}
NotImplementedException.prototype = Object.create(Error.prototype);
NotImplementedException.prototype.constructor = NotImplementedException;
module.exports = NotImplementedException
