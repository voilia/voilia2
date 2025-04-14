
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAccountDropdown } from "@/components/user/UserAccountDropdown";

export function HeaderControls() {
  return (
    <div className="flex items-center space-x-3">
      <ThemeToggle />
      <UserAccountDropdown />
    </div>
  );
}
