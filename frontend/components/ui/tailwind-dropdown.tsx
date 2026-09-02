"use client";

import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export interface DropdownOption {
  value: string;
  label: string;
}

interface TailwindDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}

export function TailwindDropdown({
  value,
  onChange,
  options,
  placeholder = "เลือก...",
  className = "w-auto min-w-[170px]",
}: TailwindDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <MenuButton className="inline-flex w-full items-center justify-between gap-x-2 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-[#4E0707] shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:ring-[#B4915B] focus:outline-hidden cursor-pointer transition-all">
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          className="-mr-1 size-5 text-gray-400 shrink-0"
        />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-50 mt-1.5 w-full min-w-[190px] origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-0.5">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <MenuItem key={option.value}>
                <button
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={`flex w-full items-center justify-between px-3.5 py-2 text-sm text-left cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#B4915B]/15 text-[#4E0707] font-semibold"
                      : "text-gray-700 data-focus:bg-[#B4915B]/10 data-focus:text-[#4E0707]"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <CheckIcon className="size-4 text-[#B4915B] shrink-0 ml-2" />
                  )}
                </button>
              </MenuItem>
            );
          })}
        </div>
      </MenuItems>
    </Menu>
  );
}
