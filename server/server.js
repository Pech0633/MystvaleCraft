const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;

// CORS
app.use(cors());

// เปิด database.db
const db = new Database(
    path.join(__dirname, "database.db"),
    {
        readonly: true
    }
);


// API
app.get("/api/players", (req, res) => {
    try {
        const players = db.prepare(`
            SELECT
                id,
                username,
                hex(uuid) AS uuid,
                money
            FROM lite_eco_dollars
            ORDER BY money DESC
        `).all();

        res.json(players);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "ไม่สามารถอ่าน database ได้"
        });
    }
});

// Start
app.listen(PORT, () => {
    console.log(`API running: http://localhost:${PORT}/api/players`);
});