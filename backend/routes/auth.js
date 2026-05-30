const express = require("express");
const router = express.Router();
const pool = require("../db/pool");


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM staff
      WHERE username = $1
      AND password = $2
      `,
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;