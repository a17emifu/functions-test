import axios, { AxiosResponse } from "axios";
import { Post } from "../db/schema";
import { Tag as TabDB } from "../db/schema";
import { insertSeeds, deleteItems } from "../db/seeds";
import { setupClient, connectDatabase } from "../db";
import { jest } from "@jest/globals";
import config from "../db/config";
import { fetchItemById, updateItem } from "../api/operations";

jest.setTimeout(20000);

const _sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
/*const _sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));*/

const requestUrl = "http://localhost:7071/api/ReadPost?id=2";
let res: AxiosResponse<Post>;
beforeEach(async () => {
  await insertSeeds();
  await _sleep(3000);
});
afterEach(async () => {
  await deleteItems();
});

describe("Tag名が変更されたとき", () => {
  it("対応するPostのTag名も変更されていること", async () => {
    const changedTagName = "changedTagName";
    const client = await setupClient(config.endpoint, config.key);
    const database = await connectDatabase(client, config.databaseId);
    const tag: TabDB = await fetchItemById(database, "tags", "2");
    if (tag) {
      tag.name = changedTagName;
      await updateItem(database, "tags", "2", tag);
    }
    // Change Feed反映まで待つ
    await _sleep(5000);

    // 対応するPostに変更が反映されているか確認
    res = await axios.get(requestUrl);
    const post = res.data;
    expect(post.tags[0].name).toEqual([changedTagName]);
  });
});
