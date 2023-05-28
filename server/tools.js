const path = require('path')

function getProjectDirectory() {
    return path.join(__dirname, '../');
}

module.exports = getProjectDirectory;
