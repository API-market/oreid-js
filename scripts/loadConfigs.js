const pkg = require('../package.json')
const fs = require('fs')

const config = {
    "version": pkg.version
}

fs.writeFileSync('./src/version.json', JSON.stringify(config, null, 2))