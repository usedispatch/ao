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