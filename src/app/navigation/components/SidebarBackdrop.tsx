
interface SidebarBackdropProps {
  visible: boolean;
  onClick: () => void;
}

export function SidebarBackdrop({ visible, onClick }: SidebarBackdropProps) {
  if (!visible) return null;
  
  return (
    <div 
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      onClick={onClick}
    />
  );
}
