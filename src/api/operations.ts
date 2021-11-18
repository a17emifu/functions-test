import { Database } from "@azure/cosmos";
/*import config from "../db/config";
import { setupClient, connectDatabase } from "../db";*/
export const fetchItemById = async <T>(
  database: Database,
  containerId: string,
  itemId: string
): Promise<T> => {
  const container = database.container(containerId);
  const { resource, requestCharge } = await container.item(itemId).read<T>();
  if (process.env.NODE_ENV === "development") {
    console.log(
      `fetch itemId ${itemId} from ${containerId} => ${requestCharge} RU`
    );
  }
  if (!resource) {
    throw console.error(
      `Cannot read an item: container ${containerId}, id ${itemId}`
    );
  }
  return resource;
};

export const updateItem = async <T>(
  database: Database,
  containerId: string,
  itemId: string,
  changedResource: T
): Promise<string> => {
  const container = database.container(containerId);
  await container.item(itemId).replace<T>(changedResource);
  const status = "Changed item.";
  return status;
};

interface FetchItemsProps {
  database: Database;
  containerId: string;
  select?: string;
  from?: string;
  where?: string;
  offset?: string;
  limit?: string;
  orderBy?: "ASC" | "DESC";
}

export const fetchItems = async <T>({
  database,
  containerId,
  select = "*",
  from = "c",
  where,
  offset,
  limit,
  orderBy,
}: FetchItemsProps): Promise<T[]> => {
  let query = `SELECT ${select} FROM ${from}`;
  query = where ? `${query} WHERE ${where}` : query;
  query = offset ? `${query} OFFSET ${offset}` : query;
  query = limit ? `${query} LIMIT ${limit}` : query;
  query = orderBy ? `${query} ORDER BY ${orderBy}` : query;
  const querySpec = { query: query };
  const container = database.container(containerId);
  const { resources, requestCharge } = await container.items
    .query<T>(querySpec)
    .fetchAll();
  if (process.env.NODE_ENV === "development") {
    console.log(
      `fetch ${resources.length} items from ${containerId} => ${requestCharge} RU`
    );
  }
  if (!resources) {
    throw console.error(`Cannot read items: container ${containerId}`);
  }
  return resources;
};

/*if (process.env.NODE_ENV === "development") {
  (async () => {
    console.log("記事を一つ読込中...");
    const client = setupClient(config.endpoint, config.key);
    const database = await connectDatabase(client, config.databaseId);
    await fetchItemById(database, "posts", "1");
  })();
}*/
