const path = require('path')
const xmlBuilder = require("xmlbuilder2");

function getProjectDirectory() {
    return path.join(__dirname, '../../');
}

function sendResponse(req, res) {
    if (req.get('Content-Type') === 'application/json') {
        res.json(res.data);
    }else if (req.get('Content-Type') === 'application/xml') {
        console.log(res.data)
        res.type('application/xml');
        res.send(xmlBuilder.create({'data': res.data}).end({prettyPrint: true}));
    }
}

module.exports = {getProjectDirectory, sendResponse};
