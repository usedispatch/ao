

function getTestData(msg)
    print('>>> hello')
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


function getProfiles()
  local results = DbAdmin:exec("SELECT * FROM Profiles;")
  return results
end

function getPosts()
  local results = DbAdmin:exec("SELECT * FROM Posts;")
  return results
end

function addPost(data)
  -- if not data then
  --   print("Error: Missing required fields in message")
  -- return

  DbAdmin:apply('INSERT INTO Posts (Id,Text, Cid, ReplyCid, ReplyUri, CreatedAt, Creator) VALUES (NULL,?, ?, ?, ?, ?, ?)', {
    data.Text,
    data.Cid,
    data.ReplyCid,
    data.ReplyUri,
    data.CreatedAt,
    data.Creator
  })
end


function addProfile(data)
  DbAdmin:apply('INSERT INTO Profiles (UserId, DisplayName) VALUES (?, ?)', {
    data.UserId,
    data.DisplayName
  })
end

