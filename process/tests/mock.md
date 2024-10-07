
###
.load-blueprint apm
apm.install "@rakis/DbAdmin"
###
sqlite3 = require("lsqlite3")
DB = DB or sqlite3.open_memory()
DbAdmin = require('@rakis/DbAdmin').new(DB)

DbAdmin:exec("create table test1 (name text);")
DbAdmin:exec("insert into test1 values('apple');")
###
Send({ Target=ao.id, Action="GetTestData" })