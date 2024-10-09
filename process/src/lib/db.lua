local sqlite3 = require("lsqlite3")
local DB = DB or sqlite3.open_memory()
local DbAdmin = require('@rakis/DbAdmin').new(DB)

function getTestData(msg)
    print('>>> hello')
    print(stmt)
    print(DbAdmin)
    local results = DbAdmin:exec("SELECT * FROM test1;")
    print("Query Results:")
	  for foo, row in ipairs(results) do
		  print(row.name)
	  end
    print('GetTestData Done!')
    local data = json.encode(results)
    return data
  end