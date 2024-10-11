/* eslint-disable @typescript-eslint/no-explicit-any */
import { dryrun, message, createDataItemSigner } from "@permaweb/aoconnect";

const SPLX_LUA_AO = "Jp72YrAFtQNxYTmKDiUge5NkVtW-SS44cEpXdgMs8tg";

interface Profile {
  UserId: string;
  DisplayName: string;
}

interface Post {
  Id: number;
  Text: string;
  Cid: string;
  ReplyCid: string;
  ReplyUri: string;
  CreatedAt: string;
  Creator: string;
}

export async function getProfiles(): Promise<Profile[]> {
  const dryrunResult = await dryrun({
    process: SPLX_LUA_AO,
    tags: [
      {
        name: "Action",
        value: "GetProfiles",
      },
    ],
  });
  console.log(JSON.parse(dryrunResult.Messages[0].Data));
  return JSON.parse(dryrunResult.Messages[0].Data);
}

export async function getPosts(): Promise<Post[]> {
  const dryrunResult = await dryrun({
    process: SPLX_LUA_AO,
    tags: [
      {
        name: "Action",
        value: "GetPosts",
      },
    ],
  });
  console.log(JSON.parse(dryrunResult.Messages[0].Data));
  return JSON.parse(dryrunResult.Messages[0].Data);
}

export async function addProfile(): Promise<void> {
  const data = {
    UserId: "123",
    DisplayName: "John Doe",
  };
  console.log("Sending Message");
  const res = await message({
    process: SPLX_LUA_AO,
    signer: createDataItemSigner((globalThis as any).arweaveWallet),
    tags: [
      {
        name: "Action",
        value: "AddProfile",
      },
    ],
    data: JSON.stringify(data),
  });
  console.log("Result", res);
}

export async function addPost(text: string): Promise<void> {
  const data = {
    Text: text,
    Cid: "dddffee", // You may want to generate this dynamically
    ReplyCid: "",
    ReplyUri: "",
    CreatedAt: new Date().toISOString(),
    Creator: await getWalletAddress(),
  };

  const res = await message({
    process: SPLX_LUA_AO,
    signer: createDataItemSigner((globalThis as any).arweaveWallet),
    tags: [
      {
        name: "Action",
        value: "AddPost",
      },
    ],
    data: JSON.stringify(data),
  });
  console.log("Result", res);
}

export async function connectArConnectWallet() {
  try {
    // connect to the ArConnect browser extension
    await (globalThis as any).arweaveWallet.connect(
      // request permissions
      ["ACCESS_ADDRESS", "SIGN_TRANSACTION"]
    );
  } catch (error) {
    alert("You should connect to ArConnect browser extension.");
    console.error(error);
    return false;
  }

  return true;
}

export async function getWalletAddress() {
  let address;
  try {
    address = await (globalThis as any).arweaveWallet.getActiveAddress();
  } catch (error) {
    console.error(error);
    return localStorage.getItem("owner");
  }

  return address;
}
