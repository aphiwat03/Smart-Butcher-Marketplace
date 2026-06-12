"use client";

import React from "react";

export type CheckoutStep = "cart" | "details" | "shipping" | "payment";

interface CheckoutStepperProps {
  activeStep: CheckoutStep;
}

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: "cart", label: "Cart" },
  { key: "details", label: "Details" },
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
];

export default function CheckoutStepper({ activeStep }: CheckoutStepperProps) {
  const activeIndex = STEPS.findIndex((s) => s.key === activeStep);

  return (
    <nav className="checkout-stepper">
      {STEPS.map((step, idx) => {
        const isActive = step.key === activeStep;
        const isPast = idx < activeIndex;

        return (
          <React.Fragment key={step.key}>
            <span
              className={`stepper-label ${isActive ? "active" : ""} ${
                isPast ? "past" : ""
              }`}
            >
              {step.label}
            </span>
            {idx < STEPS.length - 1 && (
              <span className="stepper-arrow">›</span>
            )}
          </React.Fragment>
        );
      })}

      <style jsx>{`
        .checkout-stepper {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: "Helvetica Neue", sans-serif;
          font-size: 13px;
          letter-spacing: 0.04em;
        }
        .stepper-label {
          color: #aaa;
          font-weight: 400;
          transition: color 0.2s;
        }
        .stepper-label.past {
          color: #666;
        }
        .stepper-label.active {
          color: #b4915b;
          font-weight: 600;
        }
        .stepper-arrow {
          color: #ccc;
          font-size: 15px;
          line-height: 1;
        }
      `}</style>
    </nav>
  );
}
