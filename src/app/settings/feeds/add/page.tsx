import { Input } from "@/components/ui/input";
import { FeedItem } from "@/types";

const AddFeedsPage = ({}) => {
  return (
    <main className="container w-full">
      <h1>Add feed</h1>
      <form action="">
        <input type="hidden" name="type" id="type" defaultValue="rss" />
        <Input type="text" name="title" id="title" placeholder="Title" />
        <Input type="text" name="text" id="text" placeholder="Text" />
        <Input type="text" name="xmlUrl" id="xmlUrl" placeholder="Feed Url" />
        <Input type="text" name="htmlUrl" id="htmlUrl" placeholder="Web Url" />
        {/*categories?: string[];*/}
      </form>
    </main>
  );
};

export default AddFeedsPage;
