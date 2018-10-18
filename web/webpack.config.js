var webpack = require('webpack');
var path = require('path');

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
    entry : {
        results: SRC_DIR + "/logic/results.js",
        index: SRC_DIR + "/logic/index.js"},
    output: {
        path: DIST_DIR,
        filename: "[name].min.js"
    },
    module: {
        rules: [
            {
                test: /\.js?/,
                include: SRC_DIR,
                loader: "babel-loader",
                query: {
                    presets:["react", "es2015", "stage-2"]
                }
            }
        ]
    }
};

module.exports = config;