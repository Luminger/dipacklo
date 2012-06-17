"use strict";

var net = require("net");
var ProxyTarget = require("./ProxyTarget")

module.exports = ProxyClient;

function ProxyClient(socket, target, interceptor) {
    if(!(this instanceof ProxyClient)) {
        return new ProxyClient(socket, target, interceptor);
    }

    this.interceptor = interceptor;
    this.socket = socket;
    this.socket.on("connect", this._onConnect.bind(this));
    this.socket.on("data",    this._onData.bind(this));
    this.socket.on("end",     this._onEnd.bind(this));
    this.socket.on("error",   this._onError.bind(this));
    this.target = new ProxyTarget(this, target, interceptor);
};

ProxyClient.prototype._onConnect = function() {
    this.interceptor.onClientConnect(this);
}

ProxyClient.prototype._onData = function(data) {
    this.interceptor.onClientData(data);
};

ProxyClient.prototype._onEnd = function() {
    console.log("CLI: disconnect!");
    this.target.end();
};

ProxyClient.prototype._onError = function(e) {
    console.log("CLI: " + e);
    this.end();
    this.target.end();
};

ProxyClient.prototype.write = function(data) {
    console.log("CLI: writing data to client");
    this.socket.write(data);
};

ProxyClient.prototype.end = function() {
    console.log("CLI: will close socket");
    this.socket.end();
};
