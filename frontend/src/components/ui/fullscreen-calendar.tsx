"use client";

import * as React from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import {
  CalendarPlus2,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface CalendarEvent {
  id: number | string;
  name: string;
  time: string;
  datetime: string;
  audience?: string;
  status?: string;
}

export interface CalendarData {
  day: Date;
  events: CalendarEvent[];
}

interface FullScreenCalendarProps {
  data: CalendarData[];
  onCreateEvent?: () => void;
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export function FullScreenCalendar({
  data,
  onCreateEvent,
}: FullScreenCalendarProps) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy"),
  );
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  const selectedDayEvents = React.useMemo(() => {
    return data.find((item) => isSameDay(item.day, selectedDay))?.events ?? [];
  }, [data, selectedDay]);

  const previousMonth = () => {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, "MMM-yyyy"));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  const goToToday = () => {
    setCurrentMonth(format(today, "MMM-yyyy"));
    setSelectedDay(today);
  };

  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white/80 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
        <div className="flex flex-auto">
          <div className="flex items-center gap-4">
            <div className="hidden w-20 flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 md:flex dark:border-slate-700 dark:bg-slate-800">
              <h1 className="p-1 text-xs uppercase text-gray-500 dark:text-slate-400">
                {format(today, "MMM")}
              </h1>
              <div className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white p-0.5 text-lg font-bold dark:border-slate-700 dark:bg-slate-900">
                <span>{format(today, "d")}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {format(firstDayCurrentMonth, "MMMM, yyyy")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {format(firstDayCurrentMonth, "MMM d, yyyy")} -{" "}
                {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Button variant="outline" size="icon" className="hidden lg:flex">
            <SearchIcon size={16} strokeWidth={2} aria-hidden="true" />
          </Button>

          <Separator orientation="vertical" className="hidden h-6 lg:block" />

          <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm md:w-auto rtl:space-x-reverse">
            <Button
              onClick={previousMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Navigate to previous month"
            >
              <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              onClick={goToToday}
              className="w-full rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto"
              variant="outline"
            >
              Today
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Navigate to next month"
            >
              <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <Separator orientation="horizontal" className="block w-full md:hidden" />

          <Button className="w-full gap-2 md:w-auto" onClick={onCreateEvent}>
            <CalendarPlus2 size={16} strokeWidth={2} aria-hidden="true" />
            <span>Schedule Event</span>
          </Button>
        </div>
      </div>

      <div className="lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 border-y border-gray-200 text-center text-xs font-semibold leading-6 text-gray-600 dark:border-slate-700 dark:text-slate-300 lg:flex-none">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
            <div key={label} className="border-r border-gray-200 py-2.5 last:border-r-0 dark:border-slate-700">
              {label}
            </div>
          ))}
        </div>

        <div className="flex text-xs leading-6 lg:flex-auto">
          <div className="isolate grid w-full grid-cols-7 border-x border-gray-200 dark:border-slate-700 lg:grid-rows-5">
            {days.map((day, dayIdx) => {
              const eventsForDay = data.filter((date) => isSameDay(date.day, day));
              const eventCount = eventsForDay.reduce(
                (sum, date) => sum + date.events.length,
                0,
              );

              return (
                <button
                  onClick={() => setSelectedDay(day)}
                  key={day.toISOString()}
                  type="button"
                  className={cn(
                    isDesktop && dayIdx === 0 && colStartClasses[getDay(day)],
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "bg-gray-50/70 text-gray-400 dark:bg-slate-900/50 dark:text-slate-600",
                    "flex h-20 flex-col border-b border-r border-gray-200 px-2 py-2 text-left transition hover:bg-campus-50/60 focus:z-10 dark:border-slate-700 dark:hover:bg-slate-800",
                  )}
                >
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className={cn(
                      "ml-auto flex h-6 w-6 items-center justify-center rounded-full text-[11px]",
                      isEqual(day, selectedDay) &&
                        "bg-campus-600 text-white",
                      !isEqual(day, selectedDay) && isToday(day) && "border border-campus-500 text-campus-600 dark:text-campus-400",
                    )}
                  >
                    {format(day, "d")}
                  </time>
                  {eventCount > 0 && (
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                          <span
                            key={`${day.toISOString()}-dot-${i}`}
                            className="h-1.5 w-1.5 rounded-full bg-campus-500"
                          />
                        ))}
                      </div>
                      {eventCount > 3 && (
                        <span className="text-[10px] text-gray-500 dark:text-slate-400">
                          +{eventCount - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 dark:border-slate-700">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-slate-400">
          {format(selectedDay, "EEEE, MMM d")}
        </h3>
        <div className="mt-3 space-y-2">
          {selectedDayEvents.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              No scheduled events for this day.
            </p>
          )}
          {selectedDayEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-gray-200 bg-gray-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/70"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {event.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {event.time}
                {event.audience ? ` • ${event.audience}` : ""}
                {event.status ? ` • ${event.status}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
