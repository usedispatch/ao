
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
        return results
    end
    print('GetTestData Done!')
    local data = json.encode(results)
    return data
end


function getProfiles()
  local results = DbAdmin:exec("SELECT * FROM Profiles;")
  for foo, row in ipairs(results) do
    return results
  end
end

function getPosts()
  local results = DbAdmin:exec("SELECT * FROM Posts;")
  for foo, row in ipairs(results) do
    print(row.Id)
    print(row.Text)
    print(row.Cid)
    print(row.ReplyCid)
    print(row.ReplyUri)
    print(row.CreatedAt)
    print(row.Creator)
  end
  return results
end

function addPost(data)
  -- if not data then
  --   print("Error: Missing required fields in message")
  -- return

  dbAdmin:apply('INSERT INTO Posts (Id,Text, Cid, ReplyCid, ReplyUri, CreatedAt, Creator) VALUES (NULL,?, ?, ?, ?, ?, ?)', {
    data.Text,
    data.Cid,
    data.ReplyCid,
    data.ReplyUri,
    data.CreatedAt,
    data.Creator
  })
end

