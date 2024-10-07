local sqlite3 = require("lsqlite3")
local DB = DB or sqlite3.open_memory()
local DbAdmin = require('@rakis/DbAdmin').new(DB)


DbAdmin:exec("create table test1 (name text);")
-- DbAdmin:exec("insert into test1 values('apple');")
-- DbAdmin:exec("select * from test1;")
-- DbAdmin:count("test1")