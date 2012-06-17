"use strict";

var _ = require("underscore");

module.exports = ProxyInterceptor;

function ProxyInterceptor() {
    if(!(this instanceof ProxyInterceptor)) {
        return new ProxyInterceptor();
    }

    this.client = null;
    this.server = null;
    this.handler = [];
    this.initbuffer = [];
}

ProxyInterceptor.prototype.onClientConnect = function(client) {
    _.each(this.handler, function(handler) {
        if(_.isFunction(handler.onClientConnect)) {
            handler.onClientConnect.call(handler);
        }
    });

    this.client = client;
};

ProxyInterceptor.prototype.onServerConnect = function(server) {
    _.each(this.handler, function(handler) { 
        if(_.isFunction(handler.onClientConnect)) {
            handler.onServerConnect.call(handler); 
        }
    });

    this.server = server;
};

ProxyInterceptor.prototype.onClientData = function(data) {
    if(_.isNull(this.server)) {
        _.delay(this.onClientData.bind(this, data), 100);
        return;
    }

    _.each(this.handler, function(handler) { 
        data = handler.onClientData.call(handler, data); 
    });

    this.server.write(data);
};

ProxyInterceptor.prototype.onServerData = function(data) {
    _.each(this.handler, function(handler) { 
        data = handler.onServerData.call(handler, data);
    });

    this.client.write(data);
};
