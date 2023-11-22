"use client";
import { usePreview } from "~/contexts/PreviewContext";
import Badge from "../Badge/Badge";
import { ColourPalette, CourseType } from "~/lib/definitions";
import { HiOutlineX, HiChevronUp, HiChevronDown } from "react-icons/hi";
import { SetStateAction } from "react";
import { Popover } from "react-tiny-popover";
import { useState } from "react";
import { Button, ClearPreferences } from "..";
import { useUrlState } from "~/hooks/useUrlState";

export default function AllocatedPopover() {
  const colourVariants = {
    0: "bg-purple-200 text-purple-900 text-xs ",
    1: "bg-yellow-200 text-yellow-900 text-xs",
    2: "bg-orange-200 text-orange-900 text-xs",
    3: "bg-red-200 text-red-900 text-xs",
  };
  const { events, courseData } = usePreview();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={`mt-auto flex max-w-full flex-col items-center gap-2 border-t border-t-neutral-50 p-2 pt-3.5`}
    >
      <Popover
        isOpen={isOpen}
        positions={["top"]}
        padding={10}
        onClickOutside={() => setIsOpen(false)}
        content={
          <div className="flex w-[17rem] flex-col items-center gap-1 rounded-lg border bg-white p-3 shadow-lg">
            {events.length === 0 ? (
              <p className="text-sm">
                Nothing allocated. To allocate a course drag it onto a event in
                the calendar.
              </p>
            ) : (
              <>
                {events.map((event, index) => (
                  <Badge
                    key={event.courseCode + event.type}
                    className={`${
                      colourVariants[event.colour]
                    } w-[15rem] items-center justify-between gap-1`}
                  >
                    {`${event.title} - ${CourseType[event.type]}`}
                    <Remove
                      index={index}
                      colour={event.colour}
                      setIsOpen={setIsOpen}
                    />
                  </Badge>
                ))}
                <ClearPreferences setIsOpen={setIsOpen} />
              </>
            )}
          </div>
        }
      >
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
          {events.length}/{(courseData && courseData.length) ?? 0} Allocated{" "}
          {isOpen ? <HiChevronDown /> : <HiChevronUp />}
        </Button>
      </Popover>
    </div>
  );
}

function Remove({
  index,
  colour,
  setIsOpen,
}: {
  index: number;
  colour: ColourPalette;
  setIsOpen: (value: SetStateAction<boolean>) => void;
}) {
  const colourVariants = {
    0: "hover:bg-purple-50/60 ",
    1: "hover:bg-yellow-50/60",
    2: "hover:bg-orange-50/60",
    3: "hover:bg-red-50/60",
  };

  const { events } = usePreview();
  const { replaceState } = useUrlState();

  const handleRemove = () => {
    const newEvents = events.toSpliced(index, 1);
    replaceState(newEvents, "pref");
    setIsOpen(newEvents.length !== 0);
  };
  return (
    <button
      className={`p-[0.2rem flex items-center rounded-3xl ${colourVariants[colour]}`}
      onClick={handleRemove}
    >
      <HiOutlineX size={14} />
    </button>
  );
}
