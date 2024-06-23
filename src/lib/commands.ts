export const commands = {
  next: "Next Item",
  prev: "Previous Item",
  nextUnread: "Next Unread Item",
  prevUnread: "Previous Unread Item",
  toggleNewOnTop: "Toggle New On Top",
  toggleHideRead: "Toggle Hide Read",
  toggleHideEmptyCategories: "Toggle Hide Empty Categories",
  toggleHideEmptyFeeds: "Toggle Hide Empty Feeds",
  refresh: "Refresh",
  visitSite: "Visit Site",
};

export type Command = keyof typeof commands;
