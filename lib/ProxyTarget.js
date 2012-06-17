"use strict";

var net = require("net");
var events = require("events")

module.exports = ProxyTarget;

function ProxyTarget(client, target, interceptor) {
    if(!(this instanceof ProxyTarget)) {
        return new ProxyClient(client, target, interceptor)
    }

    this.interceptor = interceptor;
    this.client = client;
    this.socket = new net.Socket();
    this.socket.on("connect", this._onConnect.bind(this));
    this.socket.on("data",    this._onData.bind(this));
    this.socket.on("end",     this._onEnd.bind(this));
    this.socket.on("error",   this._onError.bind(this));
    this.socket.connect(target.port, target.host);
};

ProxyTarget.prototype._onConnect = function() {
    this.interceptor.onServerConnect(this);
};

ProxyTarget.prototype._onData = function(data) {
    this.interceptor.onServerData(data);
};

ProxyTarget.prototype._onEnd = function() {
    console.log("TRG: closed connection!");
    this.client.end();
};

ProxyTarget.prototype._onError = function(e) {
    console.log("TRG: " + e);
    this.end();
    this.client.end();
};

ProxyTarget.prototype.write = function(data) {
    console.log("TRG: writing data to target");
    this.socket.write(data);
};

ProxyTarget.prototype.end = function() {
    console.log("TRG: will close socket");
    this.socket.end();
};
