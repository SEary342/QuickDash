import { mdiChevronDown } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { getColorLookup } from "../../types/colors";
import { iconTranslation } from "../../types/icons";

type SelectOption = {
  value: string;
  label: string;
  color: boolean;
  icon: boolean;
};

type SelectWithLabelProps = {
  id: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
};

const SelectWithLabel = ({
  id,
  value,
  options,
  onChange,
  className,
  children,
}: SelectWithLabelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative w-full ${className}`}>
      <label
        htmlFor={id}
        className="absolute left-3 top-1 text-gray-500 text-sm"
      >
        {children}
      </label>
      <div
        className="peer w-full border border-gray-300 rounded-md px-3 pt-6 pb-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.color && (
            <div
              className={`w-4 h-4 rounded ${
                getColorLookup(selectedOption.value).background
              }`}
            ></div>
          )}
          {selectedOption?.icon && iconTranslation[selectedOption.value] && (
            <Icon path={iconTranslation[selectedOption.value]} size={1} />
          )}
          <span>{selectedOption?.label || "Select an option"}</span>
        </div>
        <Icon path={mdiChevronDown} size={1} className="text-gray-500" />
      </div>
      {isOpen && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.color && (
                <div
                  className={`w-4 h-4 rounded ${
                    getColorLookup(option.value).background
                  }`}
                ></div>
              )}
              {option.icon && iconTranslation[option.value] && (
                <Icon path={iconTranslation[option.value]} size={1} />
              )}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { SelectWithLabel };
