import { GoodLibraryPage } from "@/components/GoodLibraryPage";
import * as InternalGoodCollection from "@/internal/InternalGoodCollection";

export default function GoodLibraryAppPage() {
  InternalGoodCollection.init();

  return <GoodLibraryPage />;
}
