"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Apod from "@/components/Apod";

const tabs = ["APOD"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("APOD");
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {showTitle ? (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center bg-black"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
              className="text-4xl font-bold text-white"
            >
              NASA Dashboard
            </motion.h1>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="flex h-full w-full"
          >
            <aside className="w-64 border-r border-white/20 p-6 flex flex-col space-y-4">
              <h1 className="text-xl font-bold text-center mb-4 tracking-wider">
                NASA Dashboard
              </h1>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-lg font-medium transition border-l border-transparent hover:border-white/50",
                      activeTab === tab && "border-white/80 text-white",
                    )}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </Button>
                ))}
              </nav>
            </aside>

            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="flex-1 p-8 overflow-auto border-l border-white/20"
            >
              <h2 className="text-2xl font-semibold border-b border-white/20 pb-2">
                {activeTab}
              </h2>
              <div className="mt-4 text-white/60">
                <Apod />
              </div>
            </motion.main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
