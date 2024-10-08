local function readFile(path)
    local file = assert(io.open(path, "r"))
    local content = file:read("*all")
    file:close()
    return content
end

local output = {}

-- Add the content of each file
table.insert(output, readFile("process/init.lua"))
table.insert(output, readFile("process/lib/db.lua"))
table.insert(output, readFile("process/lib/patterns.lua"))
table.insert(output, readFile("process/lib/processor.lua"))
table.insert(output, readFile("process/lib/handlers.lua"))
-- Write the combined content to output.lua
local outFile = assert(io.open("process/build/output.lua", "w"))
outFile:write(table.concat(output, "\n\n"))
outFile:close()

print("Build complete. Output written to output.lua")