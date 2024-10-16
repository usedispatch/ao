/* eslint-disable @typescript-eslint/no-explicit-any */
import { dryrun, message, createDataItemSigner } from "@permaweb/aoconnect";

const SPLX_LUA_AO = "lcBJ5-fjQHfz4hluSS8DlEY_Xj0MTDWwMsnVSWDMMuM";

export interface Profile {
  UserId: string;
  DisplayName: string;
}

//TODO(Pratik): Made this optional for backward compatible
export interface Post {
  Id: string;
  Text: string;
  Cid: string;
  ReplyCid: string;
  ReplyUri: string;
  CreatedAt: string;
  Creator: string;
  ParentId?: string;
  Likes: number;
  Replies?: Array<Post>;
}

export async function getProfiles(): Promise<Profile[]> {
  try {
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
  } catch (error) {
    console.log("Error in getProfiles", error);
    return [];
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    console.log("Getting Posts");
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
  } catch (error) {
    console.log("Error in getPosts", error);
    return [];
  }
}

export async function addProfile(
  UserId: string,
  DisplayName: string
): Promise<string> {
  try {
    const data = {
      UserId: UserId,
      DisplayName: DisplayName,
    };

    console.log("Sending Message", data);
    console.log("Arweave Wallet", (globalThis as any).arweaveWallet);
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
    return res;
  } catch (error) {
    console.log("Error in addProfile", error);
    return "";
  }
}

function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function addPost(
  text: string,
  parentId?: string
): Promise<void> {
  try {
    const data = {
      Id: generateRandomString(7),
      Text: text,
      Cid: "dddffee", // You may want to generate this dynamically
      ReplyCid: "",
      ReplyUri: "",
      CreatedAt: new Date().toISOString(),
      Creator: await getWalletAddress(),
      ParentId: parentId,
      Likes: 0,
    };
    console.log("Sending Message", data);
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
  } catch (error) {
    console.log("Error in addPost", error);
  }
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
