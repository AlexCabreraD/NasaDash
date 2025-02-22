"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getApod, getApodsForLast28Days, ApodResponse } from "@/api/nasaApi";
import { motion, AnimatePresence } from "framer-motion";

const Apod = () => {
  const [apod, setApod] = useState<ApodResponse | null>(null);
  const [pastApods, setPastApods] = useState<ApodResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedApod, setSelectedApod] = useState<ApodResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const todayApod = await getApod();
        setApod(todayApod);

        const pastApodsData = await getApodsForLast28Days();
        setPastApods(pastApodsData);
      } catch (err) {
        setError("Failed to fetch APOD data: " + err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (apod: ApodResponse) => {
    setSelectedApod(apod);
  };

  const closeModal = () => {
    setSelectedApod(null);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/20 p-6 rounded-lg border border-white/10"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {apod ? apod.title : "Loading..."}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full bg-gray-700/50 animate-pulse rounded-lg" />
            ) : apod?.media_type === "video" ? (
              <iframe
                src={apod.url}
                title={apod.title}
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            ) : (
              <Image
                src={apod?.url || ""}
                alt={apod?.title || "APOD Image"}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <>
                <div className="h-4 bg-gray-700/50 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-700/50 animate-pulse rounded w-full" />
                <div className="h-4 bg-gray-700/50 animate-pulse rounded w-1/2" />
              </>
            ) : (
              <>
                <p className="text-white/80">{apod?.explanation}</p>
                <div className="text-sm text-white/60">
                  <p>Date: {apod?.date}</p>
                  {apod?.copyright && <p>Copyright: {apod.copyright}</p>}
                </div>
                {apod?.media_type === "image" && apod.hdurl && (
                  <a
                    href={apod.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors float-end"
                  >
                    See HD Image
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-black/20 p-6 rounded-lg border border-white/10"
      >
        <h3 className="text-xl font-semibold mb-4">Past 28 Days</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 28 }).map((_, index) => (
                <div
                  key={index}
                  className="relative h-40 rounded-lg overflow-hidden bg-gray-700/50 animate-pulse"
                />
              ))
            : pastApods.map((pastApod) => (
                <div
                  key={pastApod.date}
                  className="relative h-40 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => openModal(pastApod)}
                >
                  {pastApod.media_type === "video" ? (
                    <iframe
                      src={pastApod.url}
                      title={pastApod.title}
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  ) : (
                    <Image
                      src={pastApod.url}
                      alt={pastApod.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                    <p className="text-sm text-white truncate">
                      {pastApod.title}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedApod && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-black/90 p-6 rounded-lg border border-white/10 max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold mb-4">
                {selectedApod.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-full w-full rounded-lg overflow-hidden">
                  {selectedApod.media_type === "video" ? (
                    <iframe
                      src={selectedApod.url}
                      title={selectedApod.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  ) : (
                    <Image
                      src={selectedApod.url}
                      alt={selectedApod.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <p className="text-white/80">{selectedApod.explanation}</p>
                  <div className="text-sm text-white/60">
                    <p>Date: {selectedApod.date}</p>
                    {selectedApod.copyright && (
                      <p>Copyright: {selectedApod.copyright}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className={"flex justify-between"}>
                <button
                  onClick={closeModal}
                  className="mt-4 text-sm text-white/80 hover:text-white transition-colors"
                >
                  Close
                </button>
                {selectedApod.media_type === "image" && selectedApod.hdurl && (
                  <a
                    href={selectedApod.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    See HD Image
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Apod;
