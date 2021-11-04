import internal = require("stream");

interface Document {
  id: string;
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
  ttl?: number;
}
export interface Post extends Document {
  title: string;
  date: string;
  content: string;
  isPublished: boolean;
  isDeleted: boolean;
  images: { url: string }[];
  tags: { id: string; name: string }[];
  users: { id: string; name: string }[];
  prev?: { id: string; title: string };
  next?: { id: string; title: string };
}

export interface Tag extends Document {
  name: string;
  isDeleted: boolean;
}
export interface User extends Document {
  name: string;
  isDeleted: boolean;
}
//後で削除すること
export interface Test extends Document {
  name: string;
  isDeleted: boolean;
}
