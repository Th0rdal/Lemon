require('dotenv').config()

function preventStaticSending(req, res, next) {
    /*
    checks if you are downloading something that is acceptable to download
    send 403: if requested to download files that are restricted
     */
    const blockedExtensions = process.env.BLOCKED_EXTENSIONS.split(",");
    const fileExtension = req.path.split('.').pop();
    if (blockedExtensions.includes(fileExtension)) {
        return res.status(403);
    }
    next();
}

module.exports = {preventStaticSending};