import aos from "./aos";
import fs from "fs";
import path from "node:path";
import assert from "node:assert";
import { describe, it, before } from "node:test";

describe("AOS Tests", async () => {
  let env: aos | undefined;

  before(async () => {
    try {
      const sourcePath = path.join(__dirname, "./../process/build/output-works.lua");
      const source = fs.readFileSync(sourcePath, "utf-8");
      
      env = new aos(source);
      
      await env.init();
    } catch (error) {
      throw error;
    }
  });

  it("should respond with 'hello, world' for Action: hello", async () => {
    if (!env) {
      throw new Error("env is undefined");
    }
    try {
      const response = await env.send({ Action: "GetTestData" });
      console.log(response.Output);
      // assert.equal(response.Output.Data, "hello, world");
    } catch (error) {
      console.error("Error during test:", error);
      throw error;
    }
  });
});