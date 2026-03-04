const db = require("../config/database");

/**
 * Generate a unique token based on filename
 * If filename exists, add a number prefix (1_, 2_, etc.)
 */
function generateToken(filename) {
  return new Promise((resolve, reject) => {
    // Check if token (filename) already exists
    db.get(
      "SELECT token FROM files WHERE token = ?",
      [filename],
      (err, existingFile) => {
        if (err) {
          reject(err);
          return;
        }

        // If filename doesn't exist, use it as is
        if (!existingFile) {
          resolve(filename);
          return;
        }

        // If exists, find the next available number prefix
        let counter = 1;
        const checkNextToken = () => {
          const newToken = `${counter}_${filename}`;
          db.get(
            "SELECT token FROM files WHERE token = ?",
            [newToken],
            (err, file) => {
              if (err) {
                reject(err);
                return;
              }

              if (!file) {
                resolve(newToken);
              } else {
                counter++;
                checkNextToken();
              }
            }
          );
        };

        checkNextToken();
      }
    );
  });
}

module.exports = { generateToken };