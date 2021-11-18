import { Container, Database } from "@azure/cosmos";

interface fetchItemByIdProps {
  container: Container;
  itemId: string;
}
export const fetchItemById = async <T>({
  container,
  itemId,
}: fetchItemByIdProps): Promise<T> => {
  const { resource, requestCharge } = await container.item(itemId).read<T>();
  if (process.env.NODE_ENV === "development") {
    console.log(
      `fetch itemId ${itemId} from ${container.id} => ${requestCharge} RU`
    );
  }
  if (!resource) {
    throw console.error(
      `Cannot read an item: container ${container.id}, id ${itemId}`
    );
  }
  return resource;
};

interface updateItemProps<T> {
  container: Container;
  itemId: string;
  changedResource: T;
}
export const updateItem = async <T>({
  container,
  itemId,
  changedResource,
}: updateItemProps<T>): Promise<string> => {
  await container.item(itemId).replace<T>(changedResource);
  const status = "Changed item.";
  return status;
};

interface FetchItemsProps {
  container: Container;
  select: string;
  from: string;
  join?: string;
  where?: string;
  offset?: string;
  limit?: string;
  orderBy?: "ASC" | "DESC";
}

export const fetchItems = async <T>({
  container,
  select,
  from,
  join,
  where,
  offset,
  limit,
  orderBy,
}: FetchItemsProps): Promise<T[]> => {
  let query = `SELECT ${select} FROM ${from}`;
  query = join ? `${query} JOIN ${join}` : query;
  query = where ? `${query} WHERE ${where}` : query;
  query = offset ? `${query} OFFSET ${offset}` : query;
  query = limit ? `${query} LIMIT ${limit}` : query;
  query = orderBy ? `${query} ORDER BY ${orderBy}` : query;
  const querySpec = { query: query };
  const { resources, requestCharge } = await container.items
    .query<T>(querySpec)
    .fetchAll();
  if (process.env.NODE_ENV === "development") {
    console.log(
      `fetch ${resources.length} items from ${container.id} => ${requestCharge} RU`
    );
  }
  if (!resources) {
    throw console.error(`Cannot read items: container ${container.id}`);
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
