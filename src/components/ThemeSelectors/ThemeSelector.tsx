"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { HiSun, HiMoon, HiComputerDesktop } from "react-icons/hi2";
import { Popover } from "react-tiny-popover";
import { Button } from "~/components";

export default function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div className=" h-8 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-700"></div>
    );
  }

  return (
    <Popover
      containerClassName="z-[999]"
      isOpen={isOpen}
      positions={["right"]}
      padding={10}
      onClickOutside={() => setIsOpen(false)}
      content={<ThemePopover setIsOpen={setIsOpen} />}
    >
      <button
        className="flex h-8 w-24 flex-row items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm capitalize hover:bg-neutral-100 active:bg-neutral-200 dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
        onClick={() => setIsOpen(true)}
      >
        <HiSun className=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <HiMoon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        {theme}
      </button>
    </Popover>
  );
}

function ThemePopover({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { setTheme } = useTheme();
  return (
    <ul className="space-y-1 rounded-md border bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900">
      <li>
        <Button
          variant="ghost"
          onClick={() => {
            setTheme("light");
            setIsOpen(false);
          }}
        >
          <HiSun />
          Light
        </Button>
      </li>
      <li>
        <Button
          variant="ghost"
          onClick={() => {
            setTheme("dark");
            setIsOpen(false);
          }}
        >
          <HiMoon />
          Dark
        </Button>
      </li>
      <li>
        <Button
          variant="ghost"
          onClick={() => {
            setTheme("system");
            setIsOpen(false);
          }}
        >
          <HiComputerDesktop /> System
        </Button>
      </li>
    </ul>
  );
}
