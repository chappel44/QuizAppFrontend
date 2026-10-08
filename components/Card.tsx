import { ReactNode } from "react";

interface CardProps {
  children?: ReactNode;
  hoverable?: boolean;
  direction?: "row" | "col";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  theme? : "light" | "gray" 
}

export default function Card({
  children,
  hoverable = false,
  direction = "col",
  justify = "start",
  theme = "light"
  
}: CardProps) {
  const directionClass = direction === "row" ? "flex-row" : "flex-col";

  const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  }[justify];

  const themeClass = {
    "light": "border-blue-300 bg-white",
    "gray": "border-gray-100 bg-gray-200/30 "
  }[theme]

  return (
    <div
      className={`flex ${directionClass} ${justifyClass} border ${themeClass} rounded-lg shadow p-4 ${
        hoverable
          ? "hover:scale-[1.01] transition-all duration-300 hover:bg-blue-50"
          : ""
      }`}
    >
      {children}
    </div>
  );
}