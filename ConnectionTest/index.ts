import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { create } from "../src/db";
import { Test } from "../src/db/schema";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const containerId = "test";
  const container = await create(containerId);
  const querySpec = {
    query: "SELECT * from c",
  };

  const { resources: test } = await container.items.query(querySpec).fetchAll();
  context.res = {
    status: 200 /* Defaults to 200 */,
    body: { result: test },
  };
};

export default httpTrigger;
