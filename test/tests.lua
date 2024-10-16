Test = require("@rakis/test-unit")
myTests = Test.new("My Test Suite")

myTests:add("sanity check", function()
    assert(1 + 1 == 2, "Math is broken!")
end)

myTests:add("test message", function()
    local msg = Send({Target = ao.id, Action = "GetTestData"}).receive().Data
    assert(msg == "[{\"name\":\"apple\"}]", "GetTestData action failed")
end)

myTests:add("Create and Get Profile", function()
    local userId = "test" .. math.random(1, 1000)
    local displayName = "test" .. math.random(1, 1000)
    local addProfile = Send({Target = ao.id, Action = "AddProfile", Data = "{\"UserId\":\"" .. userId .. "\", \"DisplayName\":\"" .. displayName .. "\"}"}).receive()
    local getProfile = Send({Target = ao.id, Action = "GetProfiles"}).receive().Data
    local expectedProfile = "[{\"UserId\":\"" .. userId .. "\",\"DisplayName\":\"" .. displayName .. "\"}]"
    assert(string.find(getProfile, expectedProfile) ~= nil, "GetProfiles action failed to include the newly added data")
end)
myTests:add("Create and Get Post",
function ()
    local userId = "test" .. math.random(1, 1000)
    local displayName = "test" .. math.random(1, 1000)
    local Text = "this si the post text"
    local Cid = ""
    local ReplyCid = ""
    local ReplyUri = ""
    local CreatedAt = ""
    local Creator = ""
    local ParentId = "ParentId"
    local Likes = 0
    local addPost = Send({Target = ao.id, Action = "AddPost", Data = "{\"Id\":\"" .. userId .. "\", \"Text\":\"" .. Text .. "\", \"Cid\":\"" .. Cid .. "\", \"ReplyCid\":\"" .. ReplyCid .. "\", \"ReplyUri\":\"" .. ReplyUri .. "\", \"CreatedAt\":\"" .. CreatedAt .. "\", \"Creator\":\"" .. Creator .. "\", \"ParentId\":\"" .. ParentId .. "\", \"Likes\":\"" .. Likes .. "\"}"}).receive()
    local getPost = Send({Target = ao.id, Action = "GetPosts"}).receive().Data
    -- local expectedProfile = "[{\"UserId\":\"" .. userId .. "\",\"DisplayName\":\"" .. displayName .. "\"}]"
    -- assert(string.find(getProfile, expectedProfile) ~= nil, "GetProfiles action failed to include the newly added data")
end)

-- myTests:run()
