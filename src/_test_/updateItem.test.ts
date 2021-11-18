import { Tag as TagDB } from "../db/schema";
import { insertSeeds, deleteItems } from "../db/seeds";
import { setupClient, connectDatabase } from "../db";
import { jest } from "@jest/globals";
import { fetchItemById, updateItem } from "../api/operations";

jest.setTimeout(20000);

const _sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

beforeEach(async () => {
  await insertSeeds();
  await _sleep(3000);
});
afterEach(async () => {
  await deleteItems();
});

describe("Tag名が変更されたとき", () => {
  it("変更が反映されているか確認", async () => {
    const changedTagName = "changedTagName";
    const client = await setupClient();
    const database = await connectDatabase(client);
    const container = database.container("tags");
    const tag: TagDB = await fetchItemById({ container, itemId: "2" });
    if (tag) {
      tag.name = changedTagName;
      const message = await updateItem({
        container,
        itemId: "2",
        changedResource: tag,
      });
      console.log(message);
    }

    // 対応するTagに変更が反映されているか確認
    const changedTag: TagDB = await fetchItemById({ container, itemId: "2" });
    expect(changedTag.name).toEqual(changedTagName);
  });
});
