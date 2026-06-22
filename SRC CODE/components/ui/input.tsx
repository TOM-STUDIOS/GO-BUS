import * as React from "react";
import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // always white background, never grey
        "flex w-full min-w-0 rounded-md border border-[#dce8f5] bg-white px-3 py-1 text-base text-gray-900",
        "placeholder:text-gray-400",
        // no ring, just border colour change on focus
        "outline-none focus:border-[#1a56db] focus:bg-white",
        "dark:bg-[#0f2340] dark:border-[#1e3555] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#1a8fe3] dark:focus:bg-[#0f2340]",
        "disabled:pointer-events-none disabled:opacity-50",
        "transition-colors duration-150",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
