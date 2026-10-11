import React, { ChangeEvent } from "react";

interface InputProps {
  children?: React.ReactNode
  disabled? : boolean
  type?: "text" | "password"
  name: string;
  value: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  requiredInp?: boolean;
}

export default function Input({
  name,
  disabled = false,
  type = "text",
  value,
  handleInputChange,
  label,
  children
}: InputProps) {
  return (
    <div className="flex flex-col text-gray-700">
      <label
        htmlFor={name}
        className="text-sm text-gray-700/75"
      >
        {label}
      </label>

      <div className="bg-blue-50/60 border-blue-200 border rounded px-2 py-1 flex gap-2 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500">
        {children}
        <input
          onChange={handleInputChange}
          value={value}
          required
          disabled={disabled}
          type={type}
          id={name}
          name={name}
          className="focus:outline-none w-full"
        />
      </div>
    </div>
  );
}