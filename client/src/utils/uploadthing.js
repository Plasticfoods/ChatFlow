import { generateUploadButton } from "@uploadthing/react";

const getApiUrl = () => {
  let apiUrl;
  if (import.meta.env.MODE === "development") {
    apiUrl = import.meta.env.VITE_API_URL_LOCAL;
  } else {
    apiUrl = import.meta.env.VITE_API_URL;
  }
  console.log("API URL: ", apiUrl);
  return apiUrl;
};

export const UploadButton = generateUploadButton({
  url: `${getApiUrl()}/api/uploadthing`,
});
