const express = require("express");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 8080;

// Start GoatBot
function startBot() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (code === 2) {
      console.log("Restarting GoatBot...");
      startBot();
    } else {
      console.log(`Bot exited with code ${code}`);
    }
  });
}

// Start Express server first
app.get("/", (req, res) => {
  res.send("GoatBot is running on Render!");
});

// Optional webhook endpoint
app.get("/webhook", (req, res) => {
  let VERIFY_TOKEN = "your_verify_token";

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express server running on port ${PORT}`);
  startBot(); // Start bot *after* Express is up
});
