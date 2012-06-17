"use strict";

var _ = require("underscore");
var fs = require("fs");
var util = require("util");
var protobuf = require("protobuf");

module.exports = BasePacket

var HeaderLengthOffset = 0;
var HeaderBufferOffset = 2;
var Schema = new protobuf.Schema(fs.readFileSync("./gen/diablo.desc"));
var HeaderProto = Schema["bnet.protocol.Header"];

function BasePacket() {
    if(!(this instanceof BasePacket)) {
        return BasePacket()
    }

    this.headerdata = null;
    this.header = null;
    this.headersize = 0;
    this.body = null;
    this.bodyoffset = 0;
    this.bodysize = 0;
    this.receivedsize = 0;
};

BasePacket.prototype.parseHeader = function(data) {
    this.receivedsize += data.length;
    this.headersize = data.readInt16BE(HeaderLengthOffset);
    this.headerdata = data.slice(HeaderBufferOffset, this.headersize + HeaderBufferOffset);

    try {
        this.header = HeaderProto.parse(this.headerdata);

        if(_.has(this.header, "size")) {
            this.bodysize = this.header.size;
            this.bodyoffset = HeaderBufferOffset + this.headersize;
            if(this.bodysize != 0) {
                this.body = data.slice(this.bodyoffset, this.bodyoffset + this.bodysize);
            }
        }

        if(this.getFullSize() < this.receivedsize) {
            return data.slice(this.getFullSize());
        }
    } catch(err) {
        console.log(util.inspect(err, true));
    }

    return null;
};

BasePacket.prototype.getFullSize = function() {
    return this.headersize + this.bodysize + 2;
}

BasePacket.prototype.isComplete = function() {
    if(this.getFullSize() == 0) {
        return false;
    } else {
        return this.getFullSize() <= this.receivedsize;
    }
};

BasePacket.prototype.addData = function(data) {
    if(this.isComplete()) {
        throw new Error("Packet is already complete!");
    }

    if(_.isNull(this.header)) {
        return this.parseHeader(data);
    } else {
        return null;
    }
};
