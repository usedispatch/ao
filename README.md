# ao
# Steps
###
.load-blueprint apm
apm.install "@rakis/DbAdmin"
apm.install "@rakis/test-unit"
###
.editor
sqlite3 = require("lsqlite3")
DB = DB or sqlite3.open_memory()
DbAdmin = require('@rakis/DbAdmin').new(DB)

DbAdmin:exec("create table test1 (name text);")
DbAdmin:exec("insert into test1 values('apple');")
.done
###
.load process/build/output.lua
.load test/tests.lua
###
myTests:run()