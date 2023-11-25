import React from "react";
import {
  CalendarHeader,
  TimeSlot,
  PreviewEventClient,
  EventList,
} from "~/components";
import CalendarToolbar from "./CalendarToolbar";

export default function Calendar() {
  return (
    <section className="flex w-full grow flex-col">
      <div className="grid max-h-[93vh] w-full grid-cols-[auto,repeat(5,1fr)] grid-rows-[2.5rem,repeat(38,2.35rem)] overflow-auto">
        <CalendarHeader />
        {Array.from({ length: 38 }, (_, index) => (
          <React.Fragment key={index}>
            <div
              className={`col-start-[1] ${
                "row-start-[" + [2 + index] + "]"
              } border-r border-slate-100 bg-white p-1.5 text-right text-xs font-medium uppercase text-slate-400`}
            >
              {index % 2 !== 1 && `${index / 2 + 5}:00`}
            </div>
            <TimeSlot col={2} row={2 + index} />
            <TimeSlot col={3} row={2 + index} />
            <TimeSlot col={4} row={2 + index} />
            <TimeSlot col={5} row={2 + index} />
            <TimeSlot col={6} row={2 + index} />
          </React.Fragment>
        ))}
        <EventList />
        <PreviewEventClient />
      </div>
      <CalendarToolbar />
    </section>
  );
}
