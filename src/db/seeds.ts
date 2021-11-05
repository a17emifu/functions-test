import config from "./config";
import { setupClient, createContainer } from "./index";
import { posts } from "./examples/Post";
import { tags } from "./examples/Tag";

const insertSeeds = async (testDatabaseId?: string): Promise<void> => {
  const client = setupClient(config.endpoint, config.key);
  const containerItems = [
    { id: "tags", items: tags },
    { id: "posts", items: posts },
  ];
  for (const containerItem of containerItems) {
    const container = await createContainer(
      client,
      containerItem.id,
      config.databaseId
    );
    for (const item of containerItem.items) {
      await container.items.create(item);
    }
  }
};
const deleteItems = async (): Promise<void> => {
  const client = setupClient(config.endpoint, config.key);
  const containerItems = [
    { id: "tags", items: tags },
    { id: "posts", items: posts },
  ];
  for (const containerItem of containerItems) {
    const container = await createContainer(
      client,
      containerItem.id,
      config.databaseId
    );
    for (const item of containerItem.items) {
      await container.item(item.id).delete();
    }
  }
};

const cleanUp = async (testDatabaseId?: string): Promise<void> => {
  const client = setupClient(config.endpoint, config.key);
  const databaseId = testDatabaseId ? testDatabaseId : config.databaseId;
  await client.database(databaseId).delete();
};

if (process.env.NODE_ENV === "development") {
  (async () => {
    /*console.log("シードデータ削除中...");
    await deleteItems();*/
    console.log("シードデータ挿入中...");
    await insertSeeds();
  })();
}

export { insertSeeds, cleanUp };
