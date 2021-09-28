interface Document {
  id: string;
  _rid: string;
  _self: string;
  _etag: string;
  _attachments: string;
  _ts: number;
}
export interface Post extends Document {
  title: string;
  date: string;
  content: string;
  isPublished: boolean;
  images: { url: string }[];
  tags: { id: string; name: string }[];
  user: { id: string; name: string };
  prev?: { id: string; title: string };
  next?: { id: string; title: string };
}

export interface Tag extends Document {
  name: string;
}
//後で削除すること
export interface Test extends Document {
  name: string;
}
