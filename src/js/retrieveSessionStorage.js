export default function retrieveSessionStorage(key) {
  // Check sessionStorage for a key and return the value if it exists
  return new Promise((resolve, reject) => {
    if (sessionStorage[key]) {
      // returns the value of the given key in sessionStorage
      resolve(sessionStorage.getItem(key));
    } else {
      reject(new Error("Session copy does not yet exist: ", key));
    }
  });
}
