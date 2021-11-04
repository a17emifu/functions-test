import { Tag } from "../schema";
const maxNum = process.env.NODE_ENV === "development" ? 31 : 1001;
export const tags: Tag[] = [];
for (let num = 1; num < maxNum; num++) {
  const tag: Tag = {
    id: `${num}`,
    name: `tag${num}`,
    isDeleted: false,
  };
  tags.push(tag);
}
