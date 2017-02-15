module.exports = {
    entry: './index.ts',
    output: {
        path: "bundle",
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
            { test: /\.css$/, loader: ["style-loader!css-loader"]}
        ]
    }
};