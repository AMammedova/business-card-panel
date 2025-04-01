"use client";

import * as React from "react";
import {format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

interface DatePickerWithRangeProps {
  className?: string;
  value?: DateRange | undefined;
  onChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  value,
  onChange,
}: DatePickerWithRangeProps) {
  // Use the value prop if provided, otherwise use default state
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  // Update local state when the value prop changes
  React.useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  // Handle date changes
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] py-5 justify-start text-left font-normal",
              !date && "text-gray-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
