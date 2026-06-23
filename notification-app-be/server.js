const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrb3N1cnVhYmhpcmFtLjIzLmNzbUBhbml0cy5lZHUuaW4iLCJleHAiOjE3ODIxOTkxOTIsImlhdCI6MTc4MjE5ODI5MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjIxNDY5OTFjLWYxN2ItNDM1Ny05MWNlLWExMTY0ZWMzODlkMyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFiaGlyYW0ga29zdXJ1Iiwic3ViIjoiMjcwOWU2ZjUtMmNmMy00MDZkLWFjZGEtYmE2YmU0NWViMGQ4In0sImVtYWlsIjoia29zdXJ1YWJoaXJhbS4yMy5jc21AYW5pdHMuZWR1LmluIiwibmFtZSI6ImFiaGlyYW0ga29zdXJ1Iiwicm9sbE5vIjoiYTIzMTI2NTUyMjc0IiwiYWNjZXNzQ29kZSI6Ik1UcXhhciIsImNsaWVudElEIjoiMjcwOWU2ZjUtMmNmMy00MDZkLWFjZGEtYmE2YmU0NWViMGQ4IiwiY2xpZW50U2VjcmV0IjoiemVrUGJQcEhoWHdOcFd6TiJ9.X6NpcEw-C2SS7d-p9p8NWrEj3X7K03omfIjfYcsOAM0";

app.get("/notifications", async (req, res) => {
  try {
    const response = await fetch(
      "http://4.224.186.213/evaluation-service/notifications?page=1&limit=10",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        }
      }
    );

    const data = await response.json();
    console.log("========== API RESPONSE ==========");
    console.log(JSON.stringify(data, null, 2));

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});