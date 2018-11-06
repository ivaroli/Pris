var webpack = require('webpack');
var path = require('path');

var DIST_DIR = path.resolve(__dirname, "Frontend/js/builds");
var SRC_DIR = path.resolve(__dirname, "Frontend/js");

var config = {
    entry : {
        resultsPage: SRC_DIR + "/results.js",
        indexPage: SRC_DIR + "/index.js"},
    output: {
        path: DIST_DIR,
        filename: "[name].js"
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