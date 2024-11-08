import express from "express";
import bodyParser from "body-parser";
import request from "request";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/signup.html"));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
