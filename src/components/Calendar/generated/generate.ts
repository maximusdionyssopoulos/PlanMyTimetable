import { Days } from "~/lib/definitions";
import type { Course, Preference, Time } from "~/lib/definitions";
import { convertCourseToPreference } from "~/lib/functions";

/*
 * This code is adapted from [Andogq Timetable project](https://github.com/andogq/timetable) to work with my types.
 * Copyright (C) 2022 Tom Anderson
 * Copyright (C) 2025 Maximus Dionyssopoulos
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
interface GenerateOptions {
  amount?: number;
  log?: (message: string) => void;
  rankings: Array<keyof typeof PENALTIES>;
  campus: string;
}

// Convert string time (HH:mm) to minutes since midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours! * 60 + minutes!;
}

// Convert day string to enum value
function dayToNumber(day: Time["day"]): number {
  const dayMap: Record<Time["day"], Days> = {
    Mon: Days.Monday,
    Tue: Days.Tuesday,
    Wed: Days.Wednesday,
    Thu: Days.Thursday,
    Fri: Days.Friday,
  };
  return dayMap[day];
}

function permutate(courses: Course[]): Preference[][] {
  if (courses.length === 1) {
    return courses[0]!.options.map((time) => {
      const preferences = convertCourseToPreference(courses[0]!, time);
      return Array.isArray(preferences) ? preferences : [preferences];
    });
  } else {
    const target = courses[0]!;
    const remainingOptions = permutate(courses.slice(1));
    const result: Preference[][] = [];

    for (const time of target.options) {
      const targetPreferences = convertCourseToPreference(target, time);
      const targetPrefsArray = Array.isArray(targetPreferences)
        ? targetPreferences
        : [targetPreferences];

      for (const opt of remainingOptions) {
        result.push([...targetPrefsArray, ...opt]);
      }
    }

    return result;
  }
}

function sort(timetable: Preference[]): Preference[] {
  return [...timetable].sort((a, b) => {
    const dayDiff = dayToNumber(a.time.day) - dayToNumber(b.time.day);
    if (dayDiff !== 0) return dayDiff;
    return timeToMinutes(a.time.start) - timeToMinutes(b.time.start);
  });
}

function clashes(timetable: Preference[]): boolean {
  let prevEndTime = 0;
  let currentDay = -1;

  // Sort timetable by day and time for clash detection
  const sortedTimetable = sort(timetable);

  for (const pref of sortedTimetable) {
    const day = dayToNumber(pref.time.day);
    const startTime = timeToMinutes(pref.time.start);
    const timeInMinutes = day * 24 * 60 + startTime;

    // Reset prevEndTime when day changes
    if (day !== currentDay) {
      prevEndTime = timeInMinutes;
      currentDay = day;
      continue;
    }

    if (timeInMinutes < prevEndTime) {
      return true;
    }
    prevEndTime = timeInMinutes + pref.time.duration;
  }

  return false;
}

export const PENALTIES = {
  breaks: (timetable: Preference[]) => {
    let penalty = 0;
    let currentDay = -1;
    let prevEndTime = 0;

    const sortedTimetable = sort(timetable);

    for (const pref of sortedTimetable) {
      const day = dayToNumber(pref.time.day);
      const startTime = timeToMinutes(pref.time.start);

      if (day !== currentDay) {
        prevEndTime = startTime;
        currentDay = day;
        continue;
      }

      penalty += startTime - prevEndTime;
      prevEndTime = startTime + pref.time.duration;
    }

    return penalty;
  },

  days: (timetable: Preference[]) => {
    const days = new Set(timetable.map((pref) => pref.time.day));
    return days.size;
  },

  campus: (timetable: Preference[], campus: string) => {
    return -timetable.filter((pref) => pref.time.campus_description === campus)
      .length;
  },
};

export function generate(
  courses: Course[],
  options: GenerateOptions,
): Preference[][] {
  const { amount = 10, log = console.log, rankings, campus } = options;

  const startTime = Date.now();

  // Generate all possibilities
  let timetables = permutate(courses);
  log(`Total possibilities: ${timetables.length}`);

  // Sort each timetable
  timetables = timetables.map((timetable) => sort(timetable));

  // Remove timetables with clashes
  let totalClashes = 0;
  timetables = timetables.filter((timetable) => {
    const hasClash = clashes(timetable);
    if (hasClash) totalClashes++;
    return !hasClash;
  });
  log(`Found ${totalClashes} clashes`);

  // Calculate penalties
  const timetablesWithPenalties = timetables.map((timetable) => ({
    timetable,
    penalty: Object.entries(PENALTIES).reduce(
      (obj, [key, penaltyFn]) => ({
        ...obj,
        [key]: penaltyFn(timetable, campus),
      }),
      {} as Record<string, number>,
    ),
  }));

  // Sort by rankings
  const sortedTimetables = timetablesWithPenalties.sort((a, b) => {
    for (const ranking of rankings) {
      const difference = (a.penalty[ranking] ?? 0) - (b.penalty[ranking] ?? 0);
      if (difference !== 0) return difference;
    }
    return 0;
  });

  const result = sortedTimetables
    .slice(0, amount)
    .map(({ timetable }) => timetable);

  log(`Completed in ${Date.now() - startTime}ms`);

  return result;
}
