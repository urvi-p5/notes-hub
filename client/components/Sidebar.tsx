import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Home, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: Plus,
      label: "Create Note",
      href: "/notes/create",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 md:hidden z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 h-full w-64 bg-slate-50 shadow-xl z-50 md:hidden pt-20"
          >
            <div className="p-4 space-y-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-slate-200 rounded-lg"
              >
                <X size={24} />
              </motion.button>

              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href} onClick={onClose}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer group"
                    >
                      <Icon
                        size={20}
                        className="text-slate-600 group-hover:text-blue-600 transition-colors"
                      />
                      <span className="text-slate-700 group-hover:text-blue-600 transition-colors font-medium">
                        {item.label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
