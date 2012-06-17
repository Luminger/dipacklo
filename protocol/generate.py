#!/usr/bin/env python2

import os
import shutil
import subprocess

protodir = "proto"
outdir = "../gen/"
descfile = os.path.join(outdir, "diablo.desc")
desccmd = "protoc --include_imports --proto_path={0} --descriptor_set_out={1} {2}"

if __name__ == '__main__':

    if os.path.isdir(outdir): 
        shutil.rmtree(outdir)

    os.mkdir(outdir)
        
    protos = []

    for root, dirs, files in os.walk("proto"):
        for filename in files:
            name = os.path.join(root, filename)
            protos.append(name)

    cmd = desccmd.format(protodir, descfile, " ".join(protos))
    subprocess.call(cmd, shell=True)
