const fs = require('fs')
const pkg = require('../package.json')

function getVersionFromPackageJSON() {
    const config = {
        "version": pkg.version
    }
    fs.writeFileSync('./src/version.json', JSON.stringify(config, null, 2))
}

module.exports = getVersionFromPackageJSON;
