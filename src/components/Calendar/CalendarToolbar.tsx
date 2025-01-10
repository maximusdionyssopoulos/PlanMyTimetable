import { AddFriend, FriendPopover, Share } from "~/components";
import { FriendProvider } from "~/contexts/FriendContext";
import { GeneratedPreferences } from "./generated/GeneratedPreferences";
export default function CalendarToolbar() {
  return (
    <div className="sticky bottom-0 z-50 inline-flex h-16 w-full gap-3 border-t border-t-neutral-50 bg-white px-3 py-4 dark:border-t-neutral-700 dark:bg-neutral-900 dark:text-white">
      <FriendProvider fallback={<Loading />}>
        <AddFriend />
        <FriendPopover />
      </FriendProvider>
      <GeneratedPreferences />
      <div className="ml-auto gap-1">
        <Share />
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex flex-row gap-3">
      <div className=" animate-plus h-8 w-[2.1rem] rounded-md bg-neutral-100 px-2.5 py-2 dark:bg-neutral-700"></div>
      <div className=" h-8 w-24 animate-pulse rounded-md bg-neutral-100 py-2 dark:bg-neutral-700"></div>
    </div>
  );
}
