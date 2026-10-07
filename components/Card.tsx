import { ReactNode } from "react";

interface CardProps {
  children?: ReactNode;
  hoverable?: boolean;
  direction?: "row" | "col";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

export default function Card({
  children,
  hoverable = false,
  direction = "col",
  justify = "start",
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

  return (
    <div
      className={`flex ${directionClass} ${justifyClass} border border-blue-300 bg-white rounded-lg shadow p-4 ${
        hoverable
          ? "hover:scale-[1.01] transition-all duration-300 hover:bg-blue-50"
          : ""
      }`}
    >
      {children}
    </div>
  );
}