"use client";
import { Preference } from "~/lib/definitions";
import { usePreview } from "~/contexts/PreviewContext";
import ClassCardDragOverlay from "./ClassCardDragOverlay";
import EventDragOverlay from "./EventDragOverlay";

export default function DragOverlay() {
  const { events, activeCourse } = usePreview();
  const event: Preference | undefined = events.find(
    (course) =>
      course.title === activeCourse?.title &&
      course.courseCode === activeCourse?.courseCode &&
      course.type === activeCourse?.type &&
      course.colour === activeCourse?.colour,
  );
  return event ? <EventDragOverlay /> : <ClassCardDragOverlay />;
}