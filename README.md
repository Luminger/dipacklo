Dipacklo
=======

What the...
-----------
Dipacklo is a Diablo3 interception gateway (aka. proxy) which is written for node.js.

Who needs something like this?
------------------------------
People who want to analize the protocol and data passed between Diablo3 and it's servers.
Please note that this project is a "just for fun" project. It's also highly inspired by
diablo (https://github.com/godsflaw/diablow) which does basically the same.

How to use it?
--------------

### On the linux system

    # make sure your system has protobuf and node installed
    npm install
    (cd protocol; ./generate.py)
    node dipacklo.js

### On the Diablo3 gaming box

Open your hosts file and redirect "eu.actual.battle.net" (or us) to your linux system
    
