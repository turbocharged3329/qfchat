// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: [
        '/qformChat.js',
        '/styles/style.scss'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
    },
    plugins: [
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [{
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.scss$/i,
                exclude: /node_modules/,
                use: [{
                        loader: 'file-loader',
                        options: {
                            outputPath: '/',
                            name: '[name].min.css'
                        }
                    },
                    'sass-loader',
                ]
            },
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';


    } else {
        config.mode = 'development';
    }
    return config;
};