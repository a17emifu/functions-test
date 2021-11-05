import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import config from "../src/db/config";
import { fetchItemById } from "../src/api/operations";
import { convertPostData } from "../src/api/converting";
import { setupClient, connectDatabase } from "../src/db";
import { Post as PostDb } from "../src/db/schema";
const readPost: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const client = setupClient(config.endpoint, config.key);
  const database = await connectDatabase(client, config.databaseId);
  console.log(req.query.id);
  const postDb = await fetchItemById<PostDb>(
    database,
    "posts",
    req.query.id || ""
  );
  const post = await convertPostData(postDb);

  context.res = {
    status: 200 /* Defaults to 200 */,
    body: JSON.stringify(post),
  };
};

export default readPost;
