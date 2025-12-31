// Simple in-memory store (NOT persisted)
const store = new Map();

/**
 * Save files for a given key
 * @param {string} key
 * @param {Array} files - array of file objects ({ uri, name, type })
 */
export const setFiles = (key, files) => {
  if (!key || !Array.isArray(files)) return;
  store.set(key, [...files]); // clone array
};

/**
 * Get files for a given key
 * @param {string} key
 * @returns {Array}
 */
export const getFiles = (key) => {
  const files = store.get(key);
  return files ? [...files] : [];
};

/**
 * Clear files for a given key
 * @param {string} key
 */
export const clearFiles = (key) => {
  store.delete(key);
};

/**
 * Optional: clear everything (use on logout)
 */
export const clearAllFiles = () => {
  store.clear();
};

export default {
  setFiles,
  getFiles,
  clearFiles,
  clearAllFiles,
};






// Save files (after image picker)
// setFiles("postProperty", [
//   {
//     uri: "file:///storage/emulated/0/DCIM/Camera/img1.jpg",
//     name: "img1.jpg",
//     type: "image/jpeg",
//   },
// ]);


// Read files (inside API / thunk)
// import { getFiles } from "@/lib/fileStore";
// const files = getFiles("postProperty");


// Append to FormData
// files.forEach((file) => {
//   formData.append("galleryFiles", file);
// });


// Clear after upload
// import { clearFiles } from "@/lib/fileStore";

// clearFiles("postProperty");