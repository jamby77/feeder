import { typeToFlattenedError, z } from "zod";

export const feedSchema = z.object({
  id: z.string().url(),
  xmlUrl: z.string().url(),
  htmlUrl: z.string().url(),
  title: z.string(),
  text: z.string(),
  categories: z.array(z.string()).optional(),
  lastUpdated: z.coerce.date().optional().default(new Date()),
  type: z.string().optional().default("rss"),
});

export const feedItemSchema = z.object({
  id: z.string().url(),
  feedId: z.string().url(),
  link: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().url().or(z.literal("")).optional(),
  url: z.string().url().or(z.literal("")).optional(),
  isRead: z.boolean().default(false),
  pubDate: z.coerce.date(),
});

type FeedData = z.infer<typeof feedSchema>;
type FeedItemData = z.infer<typeof feedItemSchema>;

export function validateFeed(
  feed: Record<string, any>,
): [FeedData | null, typeToFlattenedError<FeedData, string> | null] {
  const parsed = feedSchema.safeParse(feed);
  if (!parsed.success) {
    return [null, parsed.error.flatten()];
  }
  return [parsed.data, null];
}

export function validateFeedItem(
  feedItem: Record<string, any>,
  passTrough: boolean = false,
): [FeedItemData | null, typeToFlattenedError<FeedItemData, string> | null] {
  const parsed = passTrough ? feedItemSchema.passthrough().safeParse(feedItem) : feedItemSchema.safeParse(feedItem);
  if (!parsed.success) {
    return [null, parsed.error.flatten()];
  }
  return [parsed.data, null];
}
