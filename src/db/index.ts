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

export const createContainer = async (
  client: CosmosClient,
  containerItemId: string,
  databaseId: string
) => {
  const { database }: DatabaseResponse =
    await client.databases.createIfNotExists({
      id: databaseId,
    });
  const { container }: ContainerResponse = await client
    .database(database.id)
    .containers.createIfNotExists(
      { id: containerItemId },
      { offerThroughput: 400 }
    );
  return container;
};

export const setupClient = (endpoint: string, key: string) => {
  const client = new CosmosClient({ endpoint, key });
  return client;
};

export const connectDatabase = async (
  client: CosmosClient,
  databaseId: string
) => {
  const database = client.database(databaseId);
  return database;
};
