require = require('esm')(module)
require('@babel/register')
module.exports = require('./src/bin/www')
