# ao
# Steps
###
.editor
.load-blueprint apm
apm.install "@rakis/DbAdmin"
apm.install "@rakis/test-unit"
.done
###
.editor
sqlite3 = require("lsqlite3")
DB = DB or sqlite3.open_memory()
DbAdmin = require('@rakis/DbAdmin').new(DB)

DbAdmin:exec("insert into test1 values('apple');")
.done
###
.load process/build/output.lua
.load test/tests.lua
###
myTests:run()