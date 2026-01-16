"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/styles";

export interface StepperProps {
  steps: Array<{ label: string; description?: string }>;
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex items-center justify-center size-8 sm:size-10 rounded-full border-2 transition-colors",
                    isCompleted &&
                      "bg-primary border-primary text-primary-foreground",
                    isCurrent &&
                      "bg-primary border-primary text-primary-foreground",
                    isPending &&
                      "bg-background border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-5" />
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="mt-1 sm:mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-medium",
                      isCurrent && "text-foreground",
                      isPending && "text-muted-foreground",
                      isCompleted && "text-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors mx-2 md:mx-4",
                    isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
