#!/usr/bin/env node

"use strict";

var ProxyServer = require("./lib/ProxyServer")
var ProxyInterceptor = require("./lib/ProxyInterceptor")
var LogInterceptor = require("./lib/LogInterceptor");
var ProtobufInterceptor = require("./lib/ProtobufInterceptor");

var local = {host: "0.0.0.0", port: 1119};
var remote = {host: "eu.actual.battle.net", port: 1119};

var proxy = new ProxyServer(local, remote, ProxyInterceptor);
proxy.on("connect", function(interceptor) {
    interceptor.handler.push(new LogInterceptor());
    interceptor.handler.push(new ProtobufInterceptor());
});
