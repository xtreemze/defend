export default function retrieveLocalStorage(key) {
  // Check localStorage for a key and return the value if it exists
  return new Promise((resolve, reject) => {
    if (localStorage[key]) {
      // returns the value of the given key in LocalStorage
      resolve(localStorage.getItem(key));
    } else {
      reject(new Error("Local copy does not yet exist: ", key));
    }
  });
}
