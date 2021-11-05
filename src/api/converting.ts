import { Post as PostDb, Tag as TagDb } from "../db/schema";

export const convertPostData = (postDb: PostDb) => {
  const {
    id,
    title,
    date,
    content,
    isPublished,
    isDeleted,
    images,
    tags,
    users,
    prev,
    next,
  } = postDb;
  return {
    id,
    title,
    date,
    content,
    isDeleted,
    isPublished,
    images: images.map((map) => map.url),
    tags: tags.map((tag) => tag.name),
    users: users.map((user) => user.name),
    prev,
    next,
  };
};
