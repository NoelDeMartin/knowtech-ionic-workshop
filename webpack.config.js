const fs = require('fs');
const path = require('path');
const ionicConfig = require('@ionic/app-scripts/config/webpack.config.js');
const customLoader = require('custom-loader');

const local = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'src/local.json'), 'utf8'));
const env = process.env.IONIC_ENV == 'prod'? 'production' : 'development';

customLoader.loaders = {
    config: function(source) {
        source = source.replace(':env', env);
        source = source.replace(':url', local[env + '-url']);
        return source;
    }
};

function addCustomConfig(webpackConfig) {

    webpackConfig.module.loaders.push({
        loader: 'custom-loader?name=config',
        include: path.resolve(__dirname, 'src/config.json')
    });

    webpackConfig.resolve.alias = {
        '@app': path.join(__dirname, 'src')
    };

}

addCustomConfig(ionicConfig.dev);
addCustomConfig(ionicConfig.prod);

module.exports = ionicConfig;