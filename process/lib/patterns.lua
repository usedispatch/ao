function getTestDataPattern (msg) 
    if msg.Action == "GetTestData" then
        return 1
    else
        return -1
    end
end