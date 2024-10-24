# ao

# Steps

Split this way for simple debugging via AoLink

###

## 1

```
.editor
.load-blueprint apm
apm.install "@rakis/DbAdmin"
apm.install "@rakis/test-unit"
.done
```

## 2

Wait for install...

```
.editor
.load process/build/output.lua
.load test/tests.lua
.done
```

## 3

`myTests:run()`

# Some Insights

I don't think foreign Keys are working.
probably it can be fixed by this `  DbAdmin:exec[[PRAGMA foreign_keys = ON;]]`
Random String generation for Id in sqlite is not working as well.

In terms of UI
a wallet adapter equivalent is needed from aoconnect to make sure there is a standard way to connect disconnect change fetch balances and all that things.
Right now it seams like everyone is doing their own thing with window.aoconnect.

It would be nice to have a type safe way to interact with the ao api.

Its pretty annoying where there is some lua code error and it says `error:
near ")": syntax error` without any indication of which file the error is in.

would be nice if after making a send request in aos i could get the message hash and check it in ao.link
