"use strict";

const nodeExternals = require("webpack-node-externals");

module.exports = {
    target: "node",
    externals: [nodeExternals()],
    entry: "./scripts/server.js",
    output: {
        filename: "./index.js"
    }
};
