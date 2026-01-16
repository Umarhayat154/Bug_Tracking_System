"use client";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  Placeholder?: string;
  buttonLabel?: string;
  onInputChange?: (value: string) => void;
  onButtonClick?: () => void;
}

export default function PageHeader({
  title,
  subtitle,
  Placeholder = "", 
  buttonLabel = "submit",
  onInputChange,
  onButtonClick,
}: PageHeaderProps) {
  return (
    <div className="w-full bg-white  max-w-6xl mx-auto border-gray-200 py-2">
      <div className="max-w-6xl px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col border-l-2 border-l-emerald-400 ">
          <h1 className="text-xl md:text-1xl font-bold text-gray-800">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder={Placeholder}
            onChange={(e) => onInputChange?.(e.target.value)}
            className="flex-1 md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onButtonClick}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
