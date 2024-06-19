export type Command =
  | "next"
  | "prev"
  | "nextUnread"
  | "prevUnread"
  | "toggleNewOnTop"
  | "toggleHideRead"
  | "toggleHideEmptyCategories"
  | "toggleHideEmptyFeeds"
  | "refresh";

interface Shortcut {
  key: string;
  title: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  command: Command;
}

export interface AppConfig {
  id: number;
  title: string;
  refreshInterval: number;
  newOnTop: boolean;
  hideRead: boolean;
  hideEmptyCategories: boolean;
  hideEmptyFeeds: boolean;
  enableShortcuts: boolean;
  shortcuts: Shortcut[];
}

export interface Category {
  id: string;
  text: string;
  title: string;
}

export interface Feed {
  id: string;
  type: string;
  title: string;
  xmlUrl: string;
  htmlUrl?: string;
  text?: string;
  categories?: string[];
  lastUpdated?: Date;
}

export interface FeedItem {
  id: string;
  feedId: string;
  title: string;
  pubDate: Date;
  isRead: boolean;
  description?: string;
  link?: string;
  url?: string;
  image?: string;
  [key: string]: any;
}

export interface Channel {
  id: string;
  title: string;
  description: string;
  link: string;
  items: FeedItem[];
  [other: string]: any;
}
