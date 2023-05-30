require('dotenv').config()

function parseXML(req, res, next) {
    /*
    takes the preparsed xml and converts it into the same data format as json
    send 400: if there was an error with converting
     */
    let newBody = {}
    try {
        for (let tag of Object.keys(req.body["data"]["array"][0])) {
            newBody[tag] = req.body["data"]["array"][0][tag];
        }
        for(let tag of Object.keys(req.body["data"]["string"][0])) {
            newBody[tag] = req.body["data"]["string"][0][tag][0].toString();
        }
        for (let tag of Object.keys(req.body["data"]["number"][0])) {
            newBody[tag] = Number(req.body["data"]["number"][0][tag][0]);
        }
        req.body = newBody;
        next()
    }catch {
        res.sendStatus(400);
    }

}

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

module.exports = {parseXML, preventStaticSending};