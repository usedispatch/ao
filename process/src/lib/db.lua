function getTestData(msg)
    local results = DbAdmin:exec("SELECT * FROM test1;")
    local data = json.encode(results)
    return data
end


function getProfiles()
  local results = DbAdmin:exec("SELECT * FROM Profiles;")
  return json.encode(results)
end

function getPosts()
  local results = DbAdmin:exec("SELECT * FROM Posts;")
  return json.encode(results)
end

function addPost(data)
  -- if not data then
  --   print("Error: Missing required fields in message")
  -- return
  print(data.Id)
  print(data.Likes)
  print(data.Text)
  print(data.Cid)
  print(data.ReplyCid)
  print(data.ReplyUri)
  print(data.CreatedAt)
  print(data.Creator)
  print(data.ParentId)
  DbAdmin:apply('INSERT INTO Posts (Id,Text, Cid, ReplyCid, ReplyUri, CreatedAt, Creator,ParentId,Likes) VALUES (?,?, ?, ?, ?, ?, ?,?,?)', {
    data.Id,
    data.Text,
    data.Cid,
    data.ReplyCid,
    data.ReplyUri,
    data.CreatedAt,
    data.Creator,
    data.ParentId,
    data.Likes
  })
end


function addProfile(data)
  DbAdmin:apply('INSERT INTO Profiles (UserId, DisplayName) VALUES (?, ?)', {
    data.UserId,
    data.DisplayName
  })
end

