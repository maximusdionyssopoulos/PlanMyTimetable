import type { Metadata } from "next";
import { HiBookmark } from "react-icons/hi2";
import { IoExtensionPuzzleSharp } from "react-icons/io5";
import { cn } from "~/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components";
import {
  ChromeIcon,
  FirefoxIcon,
  ArcIcon,
  BraveIcon,
  OperaIcon,
  EdgeIcon,
  ExtensionIcon,
} from "./(svg)";

export const metadata: Metadata = {
  title: "Add Class",
};

export default function Page() {
  const active =
    "[&[data-state=active]]:font-medium data-[state=active]:border-b-black dark:data-[state=active]:border-b-white";
  const inactive =
    "[&[data-state=inactive]]:text-neutral-500/90 [&[data-state=inactive]]:dark:text-neutral-400";
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Automatic data gathering</h3>
      <p className="text-base">
        If your university uses Allocate+ for timetable purposes, you can gather
        the data automatically using the following steps. There are two methods
        available for automatic data gathering, either install a browser
        extension or create a bookmark (
        <a
          href="https://github.com/maximusdionyssopoulos/PlanMyTimetable#university-support"
          className="font-medium underline underline-offset-4 after:content-['_↗']"
        >
          view supported universities here
        </a>
        ).
      </p>
      <Tabs defaultValue="extensions">
        <TabsList className="flex w-full flex-row items-center gap-4 border-b dark:border-b-neutral-700">
          <TabsTrigger
            value="extensions"
            className={cn(
              "inline-flex w-fit items-center justify-center border-b-2 border-b-transparent pb-3 pt-2 transition-all ",
              active,
              inactive,
            )}
          >
            <IoExtensionPuzzleSharp />
            &nbsp;Browser Extensions
          </TabsTrigger>
          <TabsTrigger
            value="bookmark"
            className={cn(
              "inline-flex w-fit items-center justify-center border-b-2 border-b-transparent pb-3 pt-2 transition-all ",
              active,
              inactive,
            )}
          >
            <HiBookmark />
            &nbsp;Bookmark
          </TabsTrigger>
        </TabsList>
        <BrowserExtensionTab />
        <BookmarkTab />
      </Tabs>
    </div>
  );
}

const BrowserExtensionTab = () => {
  return (
    <TabsContent
      value="extensions"
      className="flex w-full items-center justify-center py-4"
    >
      <div className=" flex h-full max-w-3xl flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border p-2 dark:border-neutral-700 ">
        <div className="relative h-24 w-full ">
          <div className="absolute h-full w-full bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#737373_1px,transparent_1px)]"></div>
          <div className="relative flex items-center justify-center pt-4">
            {/* <div className="mt-1.5 rounded-xl border p-2 shadow-[0_5px_50px_-12px_rgba(250,204,21,1)] dark:border-neutral-700 dark:bg-neutral-900"> */}
            <div className="rounded-3xl shadow-[0_5px_50px_-4px_rgba(202,138,4,1)] dark:shadow-[0_5px_50px_-4px_rgba(234,179,8,1)]">
              <ExtensionIcon />
            </div>
          </div>
        </div>
        <h4 className=" text-lg font-medium">
          Install the PlanMyTimetable Capture browser extension.
        </h4>
        <div className="grid grid-cols-2 grid-rows-1 gap-3">
          <div className="flex flex-row items-center gap-2 rounded-xl border p-2 dark:border-neutral-700">
            <ChromeIcon />
            <a
              className="font-medium  after:content-['_↗']"
              href="https://chromewebstore.google.com/detail/planmytimetable-capture/copaeobjeemflpmmdlbllpoldganmdpa"
              target="_blank"
            >
              Chrome<sup className=" top-0 align-super ">*</sup>
            </a>
          </div>
          <div className="flex flex-row items-center gap-2 rounded-xl border p-2 dark:border-neutral-700">
            <FirefoxIcon />
            <a
              className="font-medium  after:content-['_↗']"
              href="https://addons.mozilla.org/en-US/firefox/addon/planmytimetable-capture/"
              target="_blank"
            >
              Firefox
            </a>
          </div>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          <sup className=" top-0 align-super ">*</sup>If you have a chromium
          based browser for example:&nbsp;
          <span className="inline-flex items-center text-center align-top">
            <EdgeIcon />
            &nbsp;Edge,
          </span>
          <span className="inline-flex items-center text-center align-top">
            &nbsp;
            <ArcIcon />
            &nbsp;Arc,
          </span>
          <span className="inline-flex items-center text-center align-top">
            &nbsp;
            <BraveIcon />
            &nbsp;Brave,
          </span>
          &nbsp;or&nbsp;
          <span className="inline-flex items-center text-center align-top">
            <OperaIcon />
            &nbsp;Opera,
          </span>
          &nbsp;you can also use the Chrome web store to install the extension.
        </p>
      </div>
    </TabsContent>
  );
};

const BookmarkTab = () => {
  return (
    <TabsContent value="bookmark" className="py-2">
      <ol className="list-inside list-decimal space-y-3 text-sm marker:font-medium">
        <li>
          Bookmark the following code ( drag this into the bookmarks bar or
          right click and bookmark link ) :
        </li>
        <div className="overflow-auto rounded-md border p-2 text-sm dark:border-neutral-600">
          <a
            id="Bookmarklet"
            href={`javascript:(() => {
    let script = document.createElement("script");
    script.src = "https://planmytimetable.vercel.app/bookmarklet.js";
    document.body.append(script);
})();`}
          >
            <code id="Bookmarklet" className="my-2 whitespace-pre p-2">
              Bookmark me:
              <br />
              &nbsp;
              {`javascript:(() => {
    let script = document.createElement("script");
    script.src = "https://planmytimetable.vercel.app/bookmarklet.js";
    document.body.append(script);
})();`}
            </code>
          </a>
        </div>
        <p>
          If you have concerns regarding privacy and security,&nbsp;
          <a
            href="https://planmytimetable.vercel.app/bookmarklet.js"
            className="font-medium underline underline-offset-4 after:content-['_↗']"
          >
            checkout the source code
          </a>
          . All data is stored locally and never leaves your computer.
        </p>
        <li>Navigate to your Allocate+ system and login.</li>
        <li>Click and run the bookmarklet on this page.</li>
        <li>Select the semester you wish to plan for.</li>
        <li>You will then be redirected to a new page with your data.</li>
      </ol>
    </TabsContent>
  );
};
