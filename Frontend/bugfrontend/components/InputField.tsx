import { Eye, EyeOff, LucideIcon } from "lucide-react";


interface InputFieldProps {
  icon: LucideIcon,
  type?: "text" | "password" | "email" | "number" | "tel",
  placeholder: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  showPassword?: boolean,
  togglePassword?: () => void
}
export default function InputField({
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  showPassword,
  togglePassword
}: InputFieldProps) {
  return (
    <div className = "relative mb-4">
      <div className = "absolute left-4 top-1/2 -translate-y-1/2  text-gray-700" >
        <Icon size = {24} />
      </div>
      <input
        type = {type}
        placeholder = {placeholder}
        value = {value}
        onChange = {onChange}
        className = "w-full pl-12 pr-12 py-4 bg-gray-100  border-gray-100 rounded-lg border-2 focus:outline-none focus:border-blue-600 "
      />
      {togglePassword && (
        <button
          type = "button"
          onClick = {togglePassword}
          className = "absolute right-4 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <EyeOff size = {20} /> : <Eye size = {20} />}
        </button>
      )
      }
    </div>
  );
}