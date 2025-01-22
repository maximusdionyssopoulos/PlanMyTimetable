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

export interface GenerateEvent {
  courses: Course[];
  options: GenerateOptions;
}

// Utility functions remain unchanged
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours! * 60 + minutes!;
}

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

export const PENALTIES = {
  breaks: (intervals: Array<{ start: number; end: number }>): number => {
    return intervals.slice(1).reduce((sum, curr, idx) => {
      return sum + (curr.start - intervals[idx]!.end);
    }, 0);
  },

  days: (daysCount: number): number => daysCount,

  campus: (pref: Preference, targetCampus: string): number => {
    return pref.time.campus_description === targetCampus ? 0 : 1;
  },
};

interface TimetableState {
  timetable: Preference[];
  penalties: {
    breaks: number;
    days: number;
    campus: number;
  };
  scheduleHash: string;
  dayMap: Map<Days, Array<{ start: number; end: number }>>;
  dayCount: Set<Days>;
  courseIndex: number;
}

export function generate(
  courses: Course[],
  options: GenerateOptions,
): Preference[][] {
  const { amount = 10, log = console.log, rankings, campus } = options;
  const startTime = Date.now();

  const orderedCourses = [...courses].sort(
    (a, b) => a.options.length - b.options.length,
  );

  const topTimetables: TimetableState[] = [];
  const scheduleHashes = new Set<string>();
  let worstScore = Infinity;

  const queue: TimetableState[] = [
    {
      timetable: [],
      penalties: { breaks: 0, days: 0, campus: 0 },
      dayMap: new Map(),
      dayCount: new Set(),
      courseIndex: 0,
      scheduleHash: "",
    },
  ];

  while (queue.length > 0) {
    const currentState = queue.pop()!;

    if (currentState.courseIndex === orderedCourses.length) {
      const hash = currentState.timetable
        .map((p) => `${p.time.day}-${p.time.start}-${p.time.duration}`)
        .sort()
        .join("|");

      if (!scheduleHashes.has(hash)) {
        scheduleHashes.add(hash);
        const score = rankings.reduce(
          (sum, rank) => sum + currentState.penalties[rank],
          0,
        );

        if (score < worstScore || topTimetables.length < amount) {
          topTimetables.push({
            ...currentState,
            timetable: [...currentState.timetable],
            scheduleHash: hash,
          });

          topTimetables.sort((a, b) => {
            if (a.penalties.campus !== b.penalties.campus) {
              return a.penalties.campus - b.penalties.campus;
            }
            return rankings.reduce(
              (diff, rank) => diff || a.penalties[rank] - b.penalties[rank],
              0,
            );
          });

          if (topTimetables.length > amount) {
            topTimetables.pop();
            worstScore = rankings.reduce(
              (sum, rank) =>
                sum + topTimetables[topTimetables.length - 1]!.penalties[rank],
              0,
            );
          }
        }
      }
      continue;
    }

    const course = orderedCourses[currentState.courseIndex]!;
    const sortedOptions = [...course.options].sort((a, b) => {
      if (a.campus_description === campus) return -1;
      if (b.campus_description === campus) return 1;
      return 0;
    });

    for (const timeOption of sortedOptions) {
      const prefs = convertCourseToPreference(course, timeOption);
      const prefsArray = Array.isArray(prefs) ? prefs : [prefs];

      let isValid = true;
      const tempDayMap = new Map(currentState.dayMap);

      // Conflict check
      for (const pref of prefsArray) {
        const day = dayToNumber(pref.time.day);
        const start = timeToMinutes(pref.time.start);
        const end = start + pref.time.duration;

        const intervals = tempDayMap.get(day) ?? [];
        let low = 0,
          high = intervals.length;
        while (low < high) {
          const mid = (low + high) >>> 1;
          intervals[mid]!.start < start ? (low = mid + 1) : (high = mid);
        }

        if (
          (low > 0 && intervals[low - 1]!.end > start) ||
          (low < intervals.length && intervals[low]!.start < end)
        ) {
          isValid = false;
          break;
        }

        const newIntervals = [...intervals];
        newIntervals.splice(low, 0, { start, end });
        tempDayMap.set(day, newIntervals);
      }

      if (!isValid) continue;

      // Calculate penalties
      let breaksPenalty = 0;
      tempDayMap.forEach((intervals) => {
        breaksPenalty += PENALTIES.breaks(intervals);
      });

      const campusPenalty = prefsArray.reduce(
        (sum, pref) => sum + PENALTIES.campus(pref, campus),
        currentState.penalties.campus,
      );

      const daysCount = new Set([
        ...currentState.dayCount,
        ...prefsArray.map((p) => dayToNumber(p.time.day)),
      ]).size;

      const newState: TimetableState = {
        timetable: [...currentState.timetable, ...prefsArray],
        penalties: {
          breaks: breaksPenalty,
          days: daysCount,
          campus: campusPenalty,
        },
        dayMap: new Map(
          Array.from(tempDayMap.entries()).map(([k, v]) => [k, [...v]]),
        ),
        dayCount: new Set([
          ...currentState.dayCount,
          ...prefsArray.map((p) => dayToNumber(p.time.day)),
        ]),
        courseIndex: currentState.courseIndex + 1,
        scheduleHash: "",
      };

      const currentScore = rankings.reduce(
        (sum, rank) => sum + newState.penalties[rank],
        0,
      );

      if (currentScore <= worstScore || topTimetables.length < amount) {
        let low = 0,
          high = queue.length;
        while (low < high) {
          const mid = (low + high) >>> 1;
          const midScore = rankings.reduce(
            (sum, rank) => sum + queue[mid]!.penalties[rank],
            0,
          );
          currentScore < midScore ? (high = mid) : (low = mid + 1);
        }
        queue.splice(low, 0, newState);
      }
    }
  }

  log(
    `Generated ${topTimetables.length} unique timetables in ${
      Date.now() - startTime
    }ms`,
  );
  return topTimetables
    .sort((a, b) => {
      if (a.penalties.campus !== b.penalties.campus) {
        return a.penalties.campus - b.penalties.campus;
      }
      return rankings.reduce(
        (diff, rank) => diff || a.penalties[rank] - b.penalties[rank],
        0,
      );
    })
    .slice(0, amount)
    .map((state) => state.timetable);
}
