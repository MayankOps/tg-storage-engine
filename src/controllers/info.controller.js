const db = require("../config/database");

exports.fileInfo = (req, res) => {

  db.get(
    "SELECT file_name,file_size,downloads,created_at FROM files WHERE token=?",
    [req.params.token],
    (err, row) => {

      if (!row) return res.status(404).json({ error: "Not found" });

      res.json(row);
    }
  );
};