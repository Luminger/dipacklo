"use strict";

module.exports = LogInterceptor;

function LogInterceptor() {
    if(!(this instanceof LogInterceptor)) {
        return new LogInterceptor();
    }
};

LogInterceptor.prototype.onClientConnect = function() {
    console.log("LOG: client connected!");
};

LogInterceptor.prototype.onServerConnect = function() {
    console.log("LOG: server connected!");
};

LogInterceptor.prototype.onClientData = function(data) {
    console.log("LOG: C->S size=" + data.length);
    return data;
};

LogInterceptor.prototype.onServerData = function(data) {
    console.log("LOG: S->C size=" + data.length);
    return data;
};
