import { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
}

export default function SectionCard({ children }: SectionCardProps) {
  return (
    <div className="w-full rounded-lg bg-blue-50 px-8 py-5 shadow-xl border-blue-800">
      {children}
    </div>
  );
}