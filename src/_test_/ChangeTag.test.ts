//これを通すためにはlease用のcollectionが必要なため、サブスクリプション:キカガクで試すこと。

import axios, { AxiosResponse } from "axios";
import { Post } from "../db/schema";
import { Tag as TabDB } from "../db/schema";
import { insertSeeds, deleteItems } from "../db/seeds";
import { setupClient, connectDatabase } from "../db";
import { jest } from "@jest/globals";
import { fetchItemById, updateItem } from "../api/operations";

jest.setTimeout(20000);

const _sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

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
    const client = await setupClient();
    const database = await connectDatabase(client);
    const container = database.container("tags");
    const tag: TabDB = await fetchItemById({ container, itemId: "2" });
    if (tag) {
      tag.name = changedTagName;
      await updateItem({ container, itemId: "2", changedResource: tag });
    }
    // Change Feed反映まで待つ
    await _sleep(5000);

    // 対応するPostに変更が反映されているか確認
    res = await axios.get(requestUrl);
    const post = res.data;
    expect(post.tags[0].name).toEqual(changedTagName);
  });
});
