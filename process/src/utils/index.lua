
function sendReply(msg, data)
    msg.reply({Data = data, Action = msg.Action .. "Response"})
end