const path = require('path');

module.exports = {
    outputPath: path.resolve(__dirname, '../', 'public'),
    root: path.resolve(__dirname),
    template: './src/public/index.html',
    favicon: './src/public/favicon.ico',
};