import { AzureFunction, Context } from "@azure/functions";
import { Post as PostDb, Tag as TagDb } from "../src/db/schema";
import { setupClient, connectDatabase } from "../src/db";
import { fetchItems, fetchItemById, updateItem } from "../src/api/operations";

const cosmosDBTrigger: AzureFunction = async function (
  context: Context,
  documents: TagDb[]
): Promise<void> {
  if (!!documents && documents.length > 0) {
    context.log("Document Id: ", documents[0].id);
    const changedTag = documents[0];
    const querySpec = {
      // tag の id が一致する post の id を取得
      select: `c.id`,
      from: `c`,
      join: `t IN c.tags`,
      where: `t.id = "${changedTag.id}"`,
    };
    const client = setupClient();
    const database = await connectDatabase(client);
    const container = database.container("posts");

    const posts: PostDb[] = await fetchItems<PostDb>({
      container,
      select: querySpec.select,
      from: querySpec.from,
      join: querySpec.join,
      where: querySpec.where,
    });
    for (const post of posts) {
      const changedPost: PostDb = await fetchItemById({
        container,
        itemId: post.id,
      });
      if (changedPost) {
        changedPost.tags.forEach((tag) => {
          if (tag.id === changedTag.id) {
            tag.name = changedTag.name;
          }
        });
        const message = await updateItem({
          container,
          itemId: changedPost.id,
          changedResource: changedPost,
        });
        console.log(message);
      }
    }
  }
};

export default cosmosDBTrigger;
