import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { fetchItems } from "../src/api/operations";
import { convertPostData } from "../src/api/converting";
import { setupClient, connectDatabase } from "../src/db";
import { Post, Post as PostDb } from "../src/db/schema";
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const client = setupClient();
  const database = await connectDatabase(client);
  const container = database.container("posts");

  // クエリを発行
  let where: string;
  if (req.query.tagId) {
    where = `EXISTS( SELECT VALUE n FROM n IN c.tags WHERE n.id = "${req.query.tagId}")`;
  }
  const querySpec = {
    select: "*",
    from: "c",
    where: where,
  };
  const postsDB = await fetchItems<PostDb>({
    container,
    select: querySpec.select,
    from: querySpec.from,
    offset: req.query.offset,
    limit: req.query.limit,
    where: querySpec.where,
  });
  // API の出力形式に変換
  const posts: Post[] = [];
  for (const postDb of postsDB) {
    const post: Post = await convertPostData(postDb);
    posts.push(post);
  }
  //全記事数も含めて返す
  const allPostsDB: PostDb[] = await fetchItems<PostDb>({
    container,
    select: querySpec.select,
    from: querySpec.from,
  });
  const totalPosts = allPostsDB.length;
  const result = {
    posts,
    totalPosts,
  };
  context.res = {
    status: 200 /* Defaults to 200 */,
    body: result,
  };
};

export default httpTrigger;
