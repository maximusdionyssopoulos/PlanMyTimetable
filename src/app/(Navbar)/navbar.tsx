import { HiBookOpen, HiHome } from "react-icons/hi2";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { ThemeSelector } from "~/components";
import ActiveLink from "./ActiveLink";
import { BMCLogo } from "./bmc";

function Navbar() {
  return (
    <nav className="sticky top-0 z-[998] flex w-svw flex-row border-b bg-white px-2 py-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white md:z-0 md:h-screen md:w-fit md:flex-col md:items-center md:justify-between md:border-b-0 md:border-r md:p-3 md:pt-8">
      <div className="inline-flex md:block md:space-y-3">
        <ActiveLink
          href="/"
          className="w-fit text-sm after:content-['PlanMyTimetable'] md:w-24 md:after:content-['Home']"
        >
          <HiHome />
        </ActiveLink>
        <ActiveLink href="/classes" className="w-fit md:w-24">
          <HiBookOpen />
          Classes
        </ActiveLink>
      </div>
      <div className="flex gap-2 text-xs md:flex-col md:pt-1">
        <ActiveLink
          href="/help"
          className="w-fit md:w-24 md:after:content-['Help']"
        >
          <HiQuestionMarkCircle size={16} />
        </ActiveLink>
        <ThemeSelector />
        <a
          href="https://www.buymeacoffee.com/maxdionyssopoulos"
          className="inline-flex h-8 w-fit items-center justify-center gap-1 whitespace-nowrap rounded-md bg-yellow-400 px-2.5 py-2 text-sm font-medium text-black shadow 
          hover:bg-yellow-500 
          dark:bg-yellow-400 dark:shadow-neutral-600 dark:hover:bg-yellow-500  
          sm:px-4"
        >
          <BMCLogo /> <span className="hidden sm:inline"> Donate</span>
        </a>
        <div className="hidden w-[6.2rem] space-y-1 border-t border-t-neutral-50 pt-2 dark:border-t-neutral-700 md:block">
          <p className="whitespace-break-spaces break-words text-xs font-medium">
            PlanMyTimetable
          </p>
          <p className=" whitespace-break-spaces break-all text-xs font-light">
            Built by Maximus Dionyssopoulos.
          </p>
          <a
            href="https://github.com/maximusdionyssopoulos"
            className="font-medium underline underline-offset-4 after:content-['_↗'] hover:font-semibold"
          >
            Github
          </a>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
