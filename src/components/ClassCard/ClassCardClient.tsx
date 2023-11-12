"use client";
import { Course, colourVariants } from "~/lib/definitions";
import { useDraggable } from "@dnd-kit/core";

export default function ClassCardClient({
  children,
  course,
}: {
  children: React.ReactNode;
  course: Course;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: course.courseCode + course.type,
      data: {
        course: course,
      },
    });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${
        isDragging && "opacity-50"
      } flex w-72 flex-col gap-1 rounded-md border-r-[6.5px] p-5 py-2.5 shadow-sm hover:bg-stone-100 ${
        colourVariants[course.colour]
      } focus:ring-1 focus:ring-stone-200 active:bg-stone-100`}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
