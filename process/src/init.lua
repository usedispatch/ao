local sqlite3 = require("lsqlite3")
local json = require("json")
DB = DB or sqlite3.open_memory()
DbAdmin = require('@rakis/DbAdmin').new(DB)

function Configure()
    -- Db = sqlite3.open_memory()
    -- dbAdmin = require('@rakis/DbAdmin').new(Db)
    DbAdmin:exec[[
    CREATE TABLE Posts (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Text TEXT NOT NULL,
        Cid TEXT NOT NULL,
        ReplyCid TEXT,
        ReplyUri TEXT,
        CreatedAt TEXT NOT NULL,
        Creator TEXT NOT NULL
    );
    ]]

    DbAdmin:exec[[
    CREATE TABLE Profiles (
        UserId TEXT PRIMARY KEY,
        DisplayName TEXT NOT NULL
    );
    ]]

    DbAdmin:exec("create table test1 (name text);")
    Configured = true
end

if not Configured then Configure() end

-- local sqlite3 = require("lsqlite3")
-- local DB = DB or sqlite3.open_memory()
-- local DbAdmin = require('@rakis/DbAdmin').new(DB)


-- DbAdmin:exec("insert into test1 values('apple');")
-- DbAdmin:exec("select * from test1;")
-- DbAdmin:count("test1")