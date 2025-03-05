import { ChangeEvent, ReactNode } from "react";

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  hasError?: boolean;
  children: ReactNode;
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  className,
  hasError = false,
  children,
}: InputWithLabelProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      <label
        htmlFor={id}
        className={`absolute left-3 top-1 text-sm peer-focus:text-blue-500 ${
          hasError ? "text-red-500" : "text-gray-500"
        }`}
      >
        {children}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className={`peer w-full border rounded-md px-3 pt-6 pb-2 text-gray-900 focus:outline-none 
          ${
            hasError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        placeholder=" "
      />
      {hasError && (
        <p className="text-red-500 text-sm mt-1">Name already exists</p>
      )}
    </div>
  );
};

export { InputWithLabel };
