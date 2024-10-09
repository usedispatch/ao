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
    local addProfile = Send({Target = ao.id, Action = "AddProfile", Data = "{\"UserId\":\"test1\", \"DisplayName\":\"test1\"}"})
    local getProfile = Send({Target = ao.id, Action = "GetProfiles"}).receive().Data
    assert(getProfile == "[{\"UserId\":\"test1\",\"DisplayName\":\"test1\"}]", "GetTestData action failed")
end)

-- myTests:run()
