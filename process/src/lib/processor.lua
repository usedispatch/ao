function getTestDataProcessor(msg)
    local data = getTestData(msg)
    sendReply(msg, data)
end


function addPostProcessor(msg)
    local data = json.decode(msg.Data)
    addPost(data)
    sendReply(msg, data)
end


function getPostsProcessor(msg)
    local data = getPosts(msg)
    sendReply(msg, data)
end


