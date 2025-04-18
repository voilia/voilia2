
import { motion } from "framer-motion";
import { Rocket, Sparkles, MessageSquare } from "lucide-react";

export function RoomWelcomeMessage({ roomName }: { roomName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center max-w-2xl mx-auto px-4">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1]
        }}
        className="flex items-center justify-center mb-6 relative"
      >
        <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
        <MessageSquare className="h-16 w-16 text-primary relative z-10" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          className="absolute -right-2 -top-2"
        >
          <Sparkles className="h-6 w-6 text-primary" />
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="text-2xl font-medium mb-3">
          Welcome to {roomName || "your new room"}! 🎉
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Your AI assistant is ready to help! Start a conversation by typing a message below.
          Together we can explore ideas, solve problems, and create something amazing.
        </p>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="inline-flex items-center gap-2 text-primary"
        >
          <Rocket className="h-4 w-4" />
          <span className="text-sm font-medium">Let's get started!</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
