import { ChangeEvent, ReactNode } from "react";

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  children: ReactNode;
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  className,
  children,
}: InputWithLabelProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      <label
        htmlFor={id}
        className="absolute left-3 top-1 text-gray-500 text-sm peer-focus:text-blue-500"
      >
        {children}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className="peer w-full border border-gray-300 rounded-md px-3 pt-6 pb-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        placeholder=" "
      />
    </div>
  );
};

export { InputWithLabel };
