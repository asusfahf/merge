import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return { theme, setTheme };
};

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <motion.button
      onClick={handleThemeToggle}
      className="relative flex items-center justify-center h-10 w-16 p-1 bg-muted/60 backdrop-blur-sm rounded-full border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-muted/80"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Switch Track */}
      <div className="absolute inset-1 bg-background/60 rounded-full" />
      
      {/* Switch Thumb */}
      <motion.div
        className="absolute w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-md flex items-center justify-center"
        animate={{
          x: theme === "light" ? -12 : 12,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {theme === "light" ? (
          <Sun className="h-4 w-4 text-white" />
        ) : (
          <Moon className="h-4 w-4 text-white" />
        )}
      </motion.div>
      
      {/* Background Icons */}
      <div className="absolute left-2 flex items-center justify-center h-6 w-6 rounded-full">
        <Sun className={`h-3 w-3 transition-opacity duration-300 ${
          theme === "light" ? "opacity-0" : "opacity-40"
        }`} />
      </div>
      
      <div className="absolute right-2 flex items-center justify-center h-6 w-6 rounded-full">
        <Moon className={`h-3 w-3 transition-opacity duration-300 ${
          theme === "dark" ? "opacity-0" : "opacity-40"
        }`} />
      </div>
    </motion.button>
  );
};