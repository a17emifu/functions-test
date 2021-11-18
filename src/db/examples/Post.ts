import dayjs = require("dayjs");
import { Post } from "../schema";

const maxNum = process.env.NODE_ENV === "development" ? 31 : 51;

export const posts: Post[] = [];
for (let num = 1; num < maxNum; num++) {
  const baseDate = dayjs("2021-07-01T09:00:00.0000000+09:00");
  const post: Post = {
    id: `${num}`,
    title: `Title ${num}`,
    date: baseDate.add(num, "hour").format("YYYY-MM-DDTHH:mm:ss.0000000Z"),
    images: [{ url: `${num}` }],
    content: `Content ${num}`,
    isPublished: num % 2 !== 0 ? true : false,
    tags: [{ id: `${num}`, name: `tag${num}` }],
    isDeleted: false,
    users: [{ id: `${num}`, name: "Testman" }],
    prev:
      num > 1
        ? {
            id: `${num - 1}`,
            title: `Title ${num - 1}`,
          }
        : undefined,
    next:
      num < maxNum - 1
        ? {
            id: `${num + 1}`,
            title: `Title ${num + 1}`,
          }
        : undefined,
  };
  posts.push(post);
}
