"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAsteroids } from "@/api/nasaApi";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const NeoWs = () => {
  const [asteroids, setAsteroids] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const startDate = formatDate(new Date());
        const endDate = formatDate(
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        );
        const data = await getAsteroids(startDate, endDate);
        setAsteroids(Object.values(data).flat());
      } catch (err) {
        setError("Failed to fetch asteroid data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center text-gray-500"
      >
        Loading asteroids...
      </motion.p>
    );

  if (error)
    return (
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center text-red-500"
      >
        {error}
      </motion.p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="p-6 border border-gray-700 bg-gray-900 text-white rounded-lg max-w-3xl shadow-lg backdrop-blur-lg"
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-3xl font-bold text-blue-400 text-center mb-6"
      >
        Near Earth Objects (NEOs) 🚀
      </motion.h1>
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
        className="space-y-4"
      >
        {asteroids.slice(0, 5).map((asteroid) => (
          <motion.li
            key={asteroid.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border border-gray-700 bg-gray-800 rounded-lg shadow-lg"
          >
            <p className="font-semibold text-lg text-blue-300">
              {asteroid.name}
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-gray-200">Size:</span>{" "}
              {asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(
                2,
              )}{" "}
              m
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-gray-200">
                Close Approach Date:
              </span>{" "}
              {asteroid.close_approach_data[0]?.close_approach_date}
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-gray-200">Miss Distance:</span>{" "}
              {Number(
                asteroid.close_approach_data[0]?.miss_distance.kilometers,
              ).toFixed(2)}{" "}
              km
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-gray-200">
                Potentially Hazardous:
              </span>{" "}
              {asteroid.is_potentially_hazardous_asteroid ? "Yes 🚨" : "No ✅"}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default NeoWs;
