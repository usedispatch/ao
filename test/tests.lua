Test = require("@rakis/test-unit")
myTests = Test.new("My Test Suite")

myTests:add("sanity check", function()
    assert(1 + 1 == 2, "Math is broken!")
end)

myTests:add("test message", function()
    local msg = Send({Target = ao.id, Action = "GetTestData"}).receive({Data = "[{\"name\":\"apple\"}]"}).Data
    assert(msg == "[{\"name\":\"apple\"}]", "GetTestData action failed")
end)

-- myTests:run()
