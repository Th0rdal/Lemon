const path = require('path')
const xmlBuilder = require("xmlbuilder2");


function sendResponse(req, res) {
    if (req.get('Accept') === 'application/json' || req.get('Accept') === "*/*") {
        res.json(res.data);
    }else if (req.get('Accept') === 'application/xml') {
        console.log(res.data)
        res.type('application/xml');
        res.send(xmlBuilder.create({'data': res.data}).end({prettyPrint: true}));
    }
}

module.exports = {sendResponse};
