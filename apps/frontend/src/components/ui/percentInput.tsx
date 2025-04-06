import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./input";

export interface PercentageInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder: string;
  min?: number;
  max?: number;
  className?: string;
}

export function PercentageInput({
  value,
  onChange,
  placeholder,
  className = "h-8",
}: PercentageInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(() => {
    return value !== undefined ? Math.round(value * 100).toString() : "";
  });

  useEffect(() => {
    const newDisplayValue =
      value !== undefined ? Math.round(value * 100).toString() : "";
    setDisplayValue(newDisplayValue);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    if (inputValue === "" || isNaN(Number(inputValue))) {
      onChange(undefined);
    } else {
      onChange(Number(inputValue) / 100);
    }
  };

  return (
    <Input
      type="number"
      placeholder={placeholder}
      step={1}
      min={0}
      max={100}
      className={className}
      value={displayValue}
      onChange={handleChange}
    />
  );
}
