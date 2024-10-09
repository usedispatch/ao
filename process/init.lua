local sqlite3 = require("lsqlite3")
local json    = require("json")

function Configure()
    Db = sqlite3.open_memory()
    dbAdmin = require('@rakis/DbAdmin').new(Db)

    dbAdmin:exec[[
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

    dbAdmin:exec[[
    CREATE TABLE Profiles (
        UserId TEXT PRIMARY KEY,
        DisplayName TEXT NOT NULL
    );
    ]]

    Configured = true
end

if not Configured then Configure() end


-- DbAdmin:exec("create table test1 (name text);")
-- DbAdmin:exec("insert into test1 values('apple');")
-- DbAdmin:exec("select * from test1;")
-- DbAdmin:count("test1")