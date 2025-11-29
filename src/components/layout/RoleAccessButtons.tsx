import { Warehouse, Shield, Building2, ShieldCheck } from "lucide-react";
import { BRAND_COLORS } from "../../constants";

type ViewMode = "consumer" | "warehouse" | "site-admin" | "corporate" | "security";

interface RoleAccessButtonsProps {
  onViewChange: (view: ViewMode) => void;
}

export const RoleAccessButtons = ({ onViewChange }: RoleAccessButtonsProps) => {
  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      <RoleButton
        icon={<Warehouse className="h-4 w-4 mr-2" />}
        label="Warehouse"
        backgroundColor={BRAND_COLORS.TAN}
        onClick={() => onViewChange("warehouse")}
      />
      <RoleButton
        icon={<Shield className="h-4 w-4 mr-2" />}
        label="Site Admin"
        backgroundColor={BRAND_COLORS.ORANGE}
        onClick={() => onViewChange("site-admin")}
      />
      <RoleButton
        icon={<Building2 className="h-4 w-4 mr-2" />}
        label="Corporate"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => onViewChange("corporate")}
      />
      <RoleButton
        icon={<ShieldCheck className="h-4 w-4 mr-2" />}
        label="Security"
        className="bg-red-600 hover:bg-red-700"
        onClick={() => onViewChange("security")}
      />
    </div>
  );
};

interface RoleButtonProps {
  icon: React.ReactNode;
  label: string;
  backgroundColor?: string;
  className?: string;
  onClick: () => void;
}

const RoleButton = ({
  icon,
  label,
  backgroundColor,
  className,
  onClick,
}: RoleButtonProps) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white ${className || "shadow-lg hover:opacity-90"}`}
    style={backgroundColor ? { backgroundColor } : undefined}
  >
    {icon}
    {label}
  </button>
);
