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
    images,
    tags,
    users,
    prev,
    next,
  };
};
