const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const TOKEN = "YOUR_Bearer_TOKEN";

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