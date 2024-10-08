# ao
# Steps
###
.load-blueprint apm
apm.install "@rakis/DbAdmin"
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
###
Send({ Target=ao.id, Action="GetTestData" })