import {
  ContainerResponse,
  CosmosClient,
  DatabaseResponse,
} from "@azure/cosmos";
import config from "./config";

const endpoint: string = config.endpoint;
const key: string = config.key;
const client = new CosmosClient({ endpoint, key });

export const create = async (containerId: string) => {
  const { database }: DatabaseResponse =
    await client.databases.createIfNotExists({
      id: config.databaseId,
    });
  const { container }: ContainerResponse = await client
    .database(database.id)
    .containers.createIfNotExists(
      { id: containerId },
      { offerThroughput: 400 }
    );
  return container;
};