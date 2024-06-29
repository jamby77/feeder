import { typeToFlattenedError, z } from "zod";

export const feedSchema = z.object({
  id: z.string().url(),
  xmlUrl: z.string().url(),
  htmlUrl: z.string().url(),
  title: z.string().min(1, { message: "Title is required" }),
  text: z.string().min(1, { message: "Title is required" }),
  categories: z.array(z.string()).optional(),
  lastUpdated: z.coerce.date().optional().default(new Date()),
  type: z.string().optional().default("rss"),
});

type FeedData = z.infer<typeof feedSchema>;

export function validateFeed(
  feed: Record<string, any>,
): [FeedData | null, typeToFlattenedError<FeedData, string> | null] {
  const parsed = feedSchema.safeParse(feed);
  if (!parsed.success) {
    return [null, parsed.error.flatten()];
  }
  return [parsed.data, null];
}
