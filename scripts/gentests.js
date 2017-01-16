"use strict";
var fs   = require("fs"),
    path = require("path"),
    pbjs = require("../cli/pbjs"),
    pbts = require("../cli/pbts");

[
    "tests/data/package.proto",
    "tests/data/rpc.proto",
    "tests/data/mapbox/vector_tile.proto",
    "tests/data/test.proto",
    "tests/data/convert.proto",
    "tests/data/comments.proto"
]
.forEach(function(file) {
    var out = file.replace(/\.proto$/, ".js");
    pbjs.main([
        "--target", "static-module",
        "--wrap", "commonjs",
        "--root", "test_" + path.basename(out, ".js"),
        "--out", out,
        file
    ], function(err) {
        if (err)
            throw err;
        var pathToRuntime = path.relative(path.dirname(out), "runtime").replace(/\\/g, "/");
        fs.writeFileSync(out, fs.readFileSync(out).toString("utf8").replace(/"protobufjs\/runtime"/g, JSON.stringify(pathToRuntime)), "utf8");
        process.stdout.write("pbjs: " + file + " -> " + out + "\n");
    })
});

[
    "tests/data/test.js"
]
.forEach(function(file) {
    var out = file.replace(/\.js$/, ".d.ts");
    pbts.main([
        "--out", out,
        "--no-comments",
        file
    ], function(err) {
        if (err)
            throw err;
        var pathToProtobufjs = path.relative(path.dirname(out), "").replace(/\\/g, "/");
        fs.writeFileSync(out, fs.readFileSync(out).toString("utf8").replace(/"protobufjs"/g, JSON.stringify(pathToProtobufjs)), "utf8");
        process.stdout.write("pbts: " + file + " -> " + out + "\n");
    });
});