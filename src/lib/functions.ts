import { ColourPalette, CourseType, Days } from "./definitions";
import type { Course, Preference, Time } from "./definitions";

export function compareDays(day1: string, day2: Days) {
  switch (day2) {
    case Days.Monday:
      return day1 === "Mon";
    case Days.Tuesday:
      return day1 === "Tue";
    case Days.Wednesday:
      return day1 === "Wed";
    case Days.Thursday:
      return day1 === "Thu";
    case Days.Friday:
      return day1 === "Fri";
  }
}
export function getDayEnum(day: string): Days {
  switch (day) {
    case "Mon":
      return Days.Monday;
    case "Tue":
      return Days.Tuesday;
    case "Wed":
      return Days.Wednesday;
    case "Thu":
      return Days.Thursday;
    case "Fri":
      return Days.Friday;
    default:
      return Days.Monday;
  }
}
export function getRowIndex(time: string) {
  // Split string from format HH:mm and get minute and hour
  const delimiterIndex = time.indexOf(":");
  const hour = Number(time.substring(0, delimiterIndex));
  const minute = Number(time.substring(delimiterIndex + 1));
  // as css grid start at 1 therefore min row is 2 for an event (header row 1)
  const offset = minute >= 30 ? 3 : 2;
  // 48(7) rows: hour * 2 as start time 24hr subtract 10 due to displaying having hours before 5am
  // add offset due to minute either on the half hour (3) or full hour (2)
  return offset + Math.ceil(hour * 2) - 10;
}

export function addMinutesToTimeString(
  time: string,
  minutesToAdd: number,
): string {
  // Split the time string into hours and minutes
  const timeParts = time.split(":");
  const hours = parseInt(timeParts[0] ?? "0", 10);
  const minutes = parseInt(timeParts[1] ?? "0", 10);

  // Create a new Date object at the specified time
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  // Add the desired number of minutes
  date.setMinutes(date.getMinutes() + minutesToAdd);

  // Format the new time into a string
  const updatedHours = date.getHours();
  const updatedMinutes = date.getMinutes();
  const updatedTimeString = `${updatedHours
    .toString()
    .padStart(2, "0")}:${updatedMinutes.toString().padStart(2, "0")}`;

  return updatedTimeString;
}

export function getCourseTypeString(
  type: CourseType,
): "Lecture" | "Tutorial" | "Workshop" | "Practical" | "Other" {
  switch (type) {
    case CourseType.Lecture:
      return "Lecture";
    case CourseType.Tutorial:
      return "Tutorial";
    case CourseType.Workshop:
      return "Workshop";
    case CourseType.Practical:
      return "Practical";
    default:
      return "Other";
  }
}

// export function getCourseType(type: string): CourseType {
//   switch (type) {
//     case "Lecture":
//       return CourseType.Lecture;
//     case "Tutorial":
//       return CourseType.Tutorial;
//     case "Workshop":
//       return CourseType.Workshop;
//     case "Practical":
//       return CourseType.Practical;
//     default:
//       return CourseType.Other;
//   }
// }

export function getColourString(
  colour: ColourPalette,
):
  | "Purple"
  | "Yellow"
  | "Red"
  | "Orange"
  | "Green"
  | "Teal"
  | "Blue"
  | "Fuchsia"
  | "Pink" {
  switch (colour) {
    case ColourPalette.Purple:
      return "Purple";
    case ColourPalette.Yellow:
      return "Yellow";
    case ColourPalette.Orange:
      return "Orange";
    case ColourPalette.Red:
      return "Red";
    case ColourPalette.Green:
      return "Green";
    case ColourPalette.Teal:
      return "Teal";
    case ColourPalette.Blue:
      return "Blue";
    case ColourPalette.Fuchsia:
      return "Fuchsia";
    case ColourPalette.Pink:
      return "Pink";
  }
}

export function groupPreferencesByStartAndDay(
  items: undefined | (Preference & { originalType: string })[],
): (Preference & { originalType: string })[][] {
  const groups: Record<string, (Preference & { originalType: string })[]> = {};

  items?.forEach((item) => {
    const key = `${item.time.start}-${item.time.day}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key]?.push(item);
  });

  return Object.values(groups);
}
export function groupTimesByStartAndDay(items: Time[] | undefined): Time[][] {
  const groups: Record<string, Time[]> = {};

  items?.forEach((item) => {
    const key = `${item.start}-${item.day}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key]?.push(item);
  });

  return Object.values(groups);
}

export function convertCourseToPreference(
  course: Course,
  time: Time,
): Preference | Array<Preference> {
  /**
   * If a time is grouped, i.e a single preference but multiple events in the calendar
   * then we need to do the following:
   * find all the matching groupped times from the course
   * set the preference to grouped and create all the preferences that are grouped
   */
  if (time.grouped) {
    const firstTwoDigits = time.grouped_code.slice(0, 2);
    const pattern = new RegExp(`^${firstTwoDigits}-P[1-9]$`);

    return course.options
      .filter((time) => time.grouped && pattern.test(time.grouped_code))
      .map((option) => ({
        id: course.id,
        title: course.title,
        courseCode: course.courseCode,
        type: course.type,
        colour: course.colour,
        grouped: true,
        grouped_code: option.grouped ? option.grouped_code : "",
        time: option,
      }));
  }
  return {
    id: course.id,
    title: course.title,
    courseCode: course.courseCode,
    type: course.type,
    colour: course.colour,
    grouped: false,
    time: time,
  };
}
