import { LucideIcon, ArrowRight } from "lucide-react";


interface RoleCardProps{
  title:string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void
}

export default function RoleCard({
  title,
  description,
  icon:Icon,
  selected,
  onClick
}: RoleCardProps) {
  return ( 
    <button
      onClick = {onClick}
      className = {`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all text-left ${selected ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-white hover:border-blue-600"
      }`}
    >
      <div className = {`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${selected ? "bg-blue-500" : "bg-blue-100"}`}>
        <Icon className = {selected ? "text-white" : "text-blue-500"} size = {24} /> 
      </div>
      <div className = "flex-1">
        <h3 className = "font-semibold text-gray-900 mb-1">{title}</h3>
        <p className = "text-sm text-gray-500">{description}</p> 
      </div>
      
      <ArrowRight className = {`shrink-0 ${selected ? "text-blue-500" : "text-blue-300"}`} size = {20} />
    </button>
  );
}