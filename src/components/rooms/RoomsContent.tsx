
import { RoomViewType } from "@/pages/Rooms";
import { RoomsList } from "@/components/rooms/RoomsList";
import { SmartStartsList } from "@/components/rooms/SmartStartsList";
import { Room } from "@/hooks/useRooms";
import { AnimatePresence, motion } from "framer-motion";

interface RoomsContentProps {
  rooms: Room[];
  isLoading: boolean;
  activeView: RoomViewType;
}

export function RoomsContent({ rooms, isLoading, activeView }: RoomsContentProps) {
  return (
    <div className="mt-6">
      <AnimatePresence mode="wait">
        {activeView === "my-rooms" ? (
          <motion.div
            key="my-rooms"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <RoomsList rooms={rooms} isLoading={isLoading} />
          </motion.div>
        ) : (
          <motion.div
            key="smart-starts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SmartStartsList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
