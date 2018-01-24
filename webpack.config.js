const path = require('path');
const ionicConfig = require('@ionic/app-scripts/config/webpack.config.js');

ionicConfig.dev.resolve.alias = {
    '@app': path.join(__dirname, 'src')
};

ionicConfig.prod.resolve.alias = {
    '@app': path.join(__dirname, 'src')
};

module.exports = ionicConfig;