"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
// If you're on the older package: import { ... } from "framer-motion";

export function AnimatedNumber({ value, className, isPercentage= true }: { value: number, className: string, isPercentage?: boolean }) {
  const count = useMotionValue(0);
  let display = useTransform(count, (latest) => latest.toFixed(2));
  isPercentage 
  ? display = useTransform(count, (latest) => latest.toFixed(2)) 
  : display = useTransform(count, (latest) => latest.toFixed(0)) 

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value, count]);

  return (
    <p className={className}>
      <motion.span>{display}</motion.span>{isPercentage && "%"}
    </p>
  );
}