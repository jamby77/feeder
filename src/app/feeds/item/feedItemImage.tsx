import Image from "next/image";
import { getFeedImage } from "@/lib/feeds";
import { FeedItem } from "@/types";

const imageSizes = {
  small: 200,
  medium: 600,
  large: 900,
} as const;
type Size = keyof typeof imageSizes;
const ratio = 178;
export const FeedItemImage = ({ item, size }: { item: FeedItem; size?: Size }) => {
  const image = getFeedImage(item);
  if (!image) {
    return null;
  }

  const imgSize = imageSizes[size || "medium"] || imageSizes.medium;
  const height = (imgSize * 100) / ratio;
  return (
    <Image
      key={image}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAHJJREFUKFOdkCEOwCAMRT8GBQ7DBbj/QTgBCgUGBwoD6RayLploVvXz+/qbVsUYl3MOWmt81ZwTrTWonPMiEUKAtfbF9t6RUgIFqVLKMsZcBocPRN4Y4wa99+ANiuWDtdYHpOaBSfP0f6BotegY8XukD9/UXoQ13hkK+gAAAABJRU5ErkJggg=="
      sizes={`(max-width: 768px) ${imageSizes.medium}px, (max-width: 1200px) ${imageSizes.large}px, ${imageSizes.small}px`}
      className="mt-4"
      src={image}
      alt={item.title}
      width={imgSize}
      height={height}
    />
  );
};

export default FeedItemImage;
