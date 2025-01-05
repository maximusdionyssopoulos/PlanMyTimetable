"use client";
import Link from "next/link";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { buttonVariants } from "~/components";
import { usePathname } from "next/navigation";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const pathname = usePathname();
  return (
    <div className=" flex w-full flex-col items-center justify-center gap-3">
      <div className=" rounded-3xl bg-neutral-200 p-4 dark:bg-neutral-800">
        <HiOutlineExclamationCircle
          fontSize={"4rem"}
          className=" stroke-red-600 dark:stroke-red-400"
        />
      </div>
      <h1 className="text-2xl font-medium">Uh oh, something went wrong</h1>
      <p>{error.message}</p>
      <div className="flex flex-col items-center justify-center">
        <p>
          Please report this issue,{" "}
          <a
            href="https://github.com/maximusdionyssopoulos/PlanMyTimetable/issues/new/choose"
            className="font-medium underline underline-offset-4 after:content-['_↗']"
          >
            by creating an issue on Github
          </a>
        </p>
        <p>(Please include the url in the issue)</p>
      </div>
      <Link
        href={pathname}
        className={buttonVariants.normalLarge}
        onClick={() => window.location.reload()}
      >
        Try again
      </Link>
    </div>
  );
}
