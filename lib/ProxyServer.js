"use strict";

var net = require("net");
var util = require("util");
var events = require("events");
var ProxyClient = require("./ProxyClient");

module.exports = ProxyServer;
util.inherits(ProxyServer, events.EventEmitter);

function ProxyServer(local, target, interceptor) {
    if(!(this instanceof ProxyServer)) {
        return new ProxyServer(local, target, interceptor)
    }

    events.EventEmitter.call(this);

    this.clients = [];
    this.local = local;
    this.target = target;
    this.interceptor = interceptor;

    this.server = net.createServer();
    this.server.on("connection", this._onConnection.bind(this));
    this.server.on("listening",  this._onListening.bind(this));
    this.server.on("close",      this._onClose.bind(this));
    this.server.on("error",      this._onError.bind(this));
    this.server.listen(this.local.port, this.local.host)
};

ProxyServer.prototype._onConnection = function(sock) {
    var interceptor = new this.interceptor();
    var client = new ProxyClient(sock, this.target, interceptor);
    this.clients.push(client);
    this.emit("connect", interceptor);
};

ProxyServer.prototype._onListening = function() {
    console.log("SRV: Started listening on " + this.local.host + ":" + this.local.port);
};

ProxyServer.prototype._onClose = function() {
    console.log("SRV: shutdown");
};

ProxyServer.prototype._onError = function() {
    console.log("SRV: " + e);
};
