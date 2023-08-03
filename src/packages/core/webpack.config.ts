import { join, resolve } from 'path';
import { Configuration } from 'webpack';

var nodeExternals = require('webpack-node-externals');

console.log(resolve(join('..', '..', '..', 'node_modules')));

const config: Configuration = {
    mode: 'development',
    target: 'node',
    entry: './index.ts',
    cache: true,
    devtool: 'inline-source-map',
    watch: true,
    externals: [nodeExternals()],
    externalsPresets: {
        node: true,
    },
    watchOptions: {
        ignored: ['dist/**'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: resolve(join('..', '..', '..', 'node_modules')),
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: resolve(__dirname, 'dist'),
    },
};

export default config;
