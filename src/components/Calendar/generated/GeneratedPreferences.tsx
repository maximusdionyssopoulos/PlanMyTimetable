"use client";
import type { Preference } from "~/lib/definitions";
import { usePreview } from "~/contexts/PreviewContext";
import { cn } from "~/lib/utils";
import { useUrlState } from "~/hooks/useUrlState";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { useCallback, useState } from "react";
import Button from "../../Button/Button";
import { SortablePopover } from "./SortablePopover";

export function GeneratedPreferences() {
  const { replaceState, appendState } = useUrlState();
  const { events, setEvents } = usePreview();
  const [generatedPreferences, setGeneratedPreferences] = useState<
    Preference[][]
  >([]);
  const [index, setIndex] = useState(-1);

  const setPreferenceToGeneratedPreferenceIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= generatedPreferences.length) return;
      setIndex(index);
      const newPreferences = generatedPreferences[index];
      if (newPreferences) {
        if (events.length === 0) {
          appendState(newPreferences, "pref");
        } else {
          replaceState(newPreferences, "pref");
        }
        setEvents(newPreferences);
      }
    },
    [
      generatedPreferences,
      events,
      setIndex,
      appendState,
      replaceState,
      setEvents,
    ],
  );

  return (
    <div className=" flex flex-row gap-3">
      <SortablePopover
        setGeneratedPreferences={setGeneratedPreferences}
        setIndex={setIndex}
      />
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
