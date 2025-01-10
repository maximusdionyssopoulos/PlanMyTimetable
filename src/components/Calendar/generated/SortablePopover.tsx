import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Button from "../../Button/Button";
import { HiMiniSparkles } from "react-icons/hi2";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { RxDragHandleDots2 } from "react-icons/rx";
import { HiOutlineX } from "react-icons/hi";
import { generate } from "./generate";
import type { PENALTIES } from "./generate";
import type { Preference } from "~/lib/definitions";
import { usePreview } from "~/contexts/PreviewContext";

function SortableItem({ id, index }: { id: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div className="inline-flex items-center gap-2">
      <p>{index}: </p>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="inline-flex w-full items-center justify-between rounded-md p-1 "
      >
        {id}
        <RxDragHandleDots2 />
      </div>
    </div>
  );
}

export function SortablePopover({
  setGeneratedPreferences,
}: {
  setGeneratedPreferences: Dispatch<SetStateAction<Preference[][]>>;
}) {
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState<Array<keyof typeof PENALTIES>>([
    "breaks",
    "days",
    "campus",
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as keyof typeof PENALTIES);
        const newIndex = items.indexOf(over.id as keyof typeof PENALTIES);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const { courseData } = usePreview();

  const generatePreferences = () => {
    setGeneratedPreferences(
      generate(courseData, {
        amount: 10,
        rankings: items,
        campus: "Melbourne City",
      }),
    );
  };

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outlineIcon">
          <HiMiniSparkles />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 h-[200dvh] backdrop-brightness-[.65]" />
        <DialogContent className="fixed left-[50%] top-[50%] z-[999] grid w-full max-w-xs translate-x-[-50%] translate-y-[-40%] gap-4 rounded-lg border bg-white p-6 shadow-lg duration-200 dark:border-neutral-600 dark:bg-neutral-800 sm:max-w-md sm:translate-y-[-55%]">
          <div className="flex flex-col space-y-3">
            <DialogTitle className="text-lg font-medium leading-none tracking-tight">
              Automatically generate a timetable based on your ideal
              preferences.
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
              Customise the rankings of the options below, to generate a set of
              timetable options that best accomodate your options ranked from 1
              to 3.
              <br />
              <br />
              Please note at the moment the generated preferences do not take
              into consideration, blocked times or friends.
            </DialogDescription>
          </div>
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map((id, index) => (
                <SortableItem key={id} id={id} index={index + 1} />
              ))}
            </SortableContext>
          </DndContext>
          <DialogClose asChild>
            <Button className="w-full" onClick={generatePreferences}>
              Generate
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <button className="absolute right-2 top-2 rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700">
              <HiOutlineX />
            </button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
