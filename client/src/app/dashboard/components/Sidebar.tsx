"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  FileText,
  Users,
  BarChart2,
  Shield,
  MapPin,
  Package,
  Settings,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    section: "MAIN MENU",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", badge: null },
      { icon: Map, label: "Live Map", href: "/dashboard/map", badge: null },
      { icon: FileText, label: "All Complaints", href: "/dashboard/all-complaints", badge: 12 },
      { icon: Users, label: "Citizens", href: "/dashboard/citizens", badge: null },
      { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics", badge: null },
    ],
  },
  {
    section: "MANAGEMENT",
    items: [
      { icon: Shield, label: "Ward Manager", href: "/dashboard/ward-manager", badge: null },
      { icon: Package, label: "Resources", href: "/dashboard/resources", badge: null },
      { icon: Settings, label: "Settings", href: "/dashboard/settings", badge: null },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      className="fixed left-0 top-0 h-full w-[230px] bg-[#111827] flex flex-col z-50 shadow-xl"
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push('/dashboard')}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-[15px] leading-tight tracking-wide">
              NagarSeva
            </h1>
            <p className="text-gray-400 text-[10px] font-medium tracking-wider uppercase">
              Admin Panel
            </p>
          </div>
        </motion.div>
        <p className="text-gray-500 text-[10px] mt-2 pl-0.5">
          Mumbai Municipal Corp.
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-6" : ""}>
            <p className="text-gray-500 text-[10px] font-semibold tracking-widest px-3 mb-2 uppercase">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const isHover = hovered === item.label;

                return (
                  <li key={item.label}>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleNavigation(item.href)}
                      onMouseEnter={() => setHovered(item.label)}
                      onMouseLeave={() => setHovered(null)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group cursor-pointer ${isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-indigo-600 rounded-lg"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <item.icon
                        className={`w-4 h-4 relative z-10 flex-shrink-0 ${isActive ? "text-white" : ""
                          }`}
                      />
                      <span className="relative z-10 flex-1 text-left text-[13px]">
                        {item.label}
                      </span>
                      {item.badge && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive
                            ? "bg-white/20 text-white"
                            : "bg-indigo-500/20 text-indigo-400"
                            }`}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                      {!item.badge && isHover && !isActive && (
                        <ChevronRight className="w-3.5 h-3.5 relative z-10 opacity-50" />
                      )}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <motion.div
          whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          className="flex items-center gap-3 rounded-lg px-2 py-2 cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow">
            AP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[12px] font-semibold truncate">
              Admin Panel
            </p>
            <p className="text-gray-500 text-[10px] truncate">
              admin@nagarseva.gov.in
            </p>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
}
