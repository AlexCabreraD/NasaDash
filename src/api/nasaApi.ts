import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/errorHandler";

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

export interface ApodResponse {
  copyright: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  title: string;
  url: string;
  date: string;
}

export interface NeoResponse {
  near_earth_objects: Record<string, unknown>;
}

export const getApod = async (date?: string): Promise<ApodResponse> => {
  try {
    const response = await axiosInstance.get("/planetary/apod", {
      params: {
        api_key: NASA_API_KEY,
        ...(date && { date }),
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error("Error fetching APOD data:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getApodsForLast28Days = async (): Promise<ApodResponse[]> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    endDate.setDate(endDate.getDate() - 2);
    startDate.setDate(endDate.getDate() - 27);

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    const response = await axiosInstance.get("/planetary/apod", {
      params: {
        api_key: NASA_API_KEY,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      },
    });

    return response.data.reverse();
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error("Error fetching APOD data:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getNeoFeed = async (
  startDate: string,
  endDate: string,
): Promise<NeoResponse> => {
  const response = await axiosInstance.get("/neo/rest/v1/feed", {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data;
};

const NASA_NEOWS_BASE_URL = "/neo/rest/v1";

/**
 * Fetch Near Earth Objects (NEO) from NASA's NeoWs API.
 * @param startDate - The start date in YYYY-MM-DD format.
 * @param endDate - The end date in YYYY-MM-DD format.
 */
export const getAsteroids = async (startDate: string, endDate: string) => {
  try {
    const response = await axiosInstance.get(`${NASA_NEOWS_BASE_URL}/feed`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: NASA_API_KEY,
      },
    });
    return response.data.near_earth_objects;
  } catch (error) {
    console.error("Error fetching asteroid data:", error);
    throw new Error("Failed to fetch asteroid data.");
  }
};
