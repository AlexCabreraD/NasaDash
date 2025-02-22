import axios from "axios";

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || "An error occurred with the NASA API."
    );
  }
  return "An unknown error occurred.";
};
