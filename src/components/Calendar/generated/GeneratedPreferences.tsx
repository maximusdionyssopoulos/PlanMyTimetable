"use client";
import type { Preference } from "~/lib/definitions";
import { usePreview } from "~/contexts/PreviewContext";
import { cn } from "~/lib/utils";
import { useUrlState } from "~/hooks/useUrlState";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { useState } from "react";
import Button from "../../Button/Button";
import { SortablePopover } from "./SortablePopover";

export function GeneratedPreferences() {
  const { replaceState, appendState } = useUrlState();
  const { events, setEvents } = usePreview();
  const [generatedPreferences, setGeneratedPreferences] = useState<
    Preference[][]
  >([]);
  const [index, setIndex] = useState(-1);

  const setPreferenceToGeneratedPreferenceIndex = (index: number) => {
    // bounds checking
    if (index < 0 || index >= generatedPreferences.length) return;
    // update the index displayed
    setIndex(index);

    // get the newPreference from the index
    const newPreferences = generatedPreferences[index];

    // undefined check
    if (newPreferences) {
      // update the url state by adding or replacing the state in the url and setting the events.
      if (events.length === 0) {
        appendState(newPreferences, "pref");
      } else {
        replaceState(newPreferences, "pref");
      }
      setEvents(newPreferences);
    }
  };

  return (
    <div className=" flex flex-row gap-3">
      <SortablePopover setGeneratedPreferences={setGeneratedPreferences} />
      <GeneratedSelector
        index={index}
        count={generatedPreferences.length}
        disabled={generatedPreferences.length === 0}
        handleClick={setPreferenceToGeneratedPreferenceIndex}
      />
    </div>
  );
}

function GeneratedSelector({
  index,
  count,
  disabled,
  handleClick,
}: {
  index: number;
  count: number;
  disabled: boolean;
  handleClick: (index: number) => void;
}) {
  return (
    <div className="flex flex-row items-center gap-1">
      <Button
        disabled={disabled}
        variant={"ghostIcon"}
        onClick={() => handleClick(index - 1)}
        className={
          disabled
            ? "text-neutral-300 hover:cursor-not-allowed dark:text-neutral-500"
            : ""
        }
      >
        <FiChevronsLeft />
      </Button>
      <span
        className={cn(
          "text-sm",
          disabled &&
            "text-neutral-300 hover:cursor-not-allowed dark:text-neutral-500",
        )}
      >{`${index + 1}/${count}`}</span>
      <Button
        disabled={disabled}
        variant={"ghostIcon"}
        onClick={() => handleClick(index + 1)}
        className={
          disabled
            ? "text-neutral-300 hover:cursor-not-allowed dark:text-neutral-500"
            : ""
        }
      >
        <FiChevronsRight />
      </Button>
    </div>
  );
}
