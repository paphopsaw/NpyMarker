const path = require('path');

module.exports = {
    entry: ['babel-polyfill', path.resolve(__dirname, './src/app/index.js')],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        alias: {
            NpyMarker: path.resolve(__dirname, 'src/NpyMarker')
        },
        extensions: ['*', '.js']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    devServer: {
        static: path.resolve(__dirname, './dist')
    }
}