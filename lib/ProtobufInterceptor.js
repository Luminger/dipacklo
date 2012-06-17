"use strict";

var _ = require("underscore");
var util = require("util");
var BasePacket = require("./BasePacket");

module.exports = ProtobufInterceptor;

function ProtobufInterceptor() {
    if(!(this instanceof ProtobufInterceptor)) {
        return new ProtobufInterceptor();
    }

    this.clientpkg = null;
    this.serverpkg = null;
};

ProtobufInterceptor.prototype.onClientData = function(data) {
    var remainder = data;
    do {
        var packet = null;
        if(_.isNull(this.clientpkg)) {
            packet = new BasePacket();
        } else {
            packet = this.clientpkg;
            this.clientpkg = null;
        }
        remainder = packet.addData(remainder);
        console.log("===========================================");
        console.log("Packet: " + util.inspect(packet, true));
        console.log("===========================================");

        if(!packet.isComplete()) {
            this.clientpkg = packet;
        }
    } while(!_.isNull(remainder))

    return data;
};

ProtobufInterceptor.prototype.onServerData = function(data) {
    var remainder = data;
    do {
        var packet = null;
        if(_.isNull(this.serverpkg)) {
            packet = new BasePacket();
        } else {
            packet = this.serverpkg;
            this.serverpkg = null;
        }
        remainder = packet.addData(remainder);
        console.log("===========================================");
        console.log("Packet: " + util.inspect(packet, true));
        console.log("===========================================");

        if(!packet.isComplete()) {
            this.serverpkg = packet;
        }
    } while(!_.isNull(remainder))

    return data;
};
