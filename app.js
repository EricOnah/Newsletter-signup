import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import https from "https";
// import path from "path";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname)));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  //   res.sendFile(path.join(__dirname, "/signup.html"));
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const { firstName, lastName, email } = req.body;
  console.log(firstName, lastName, email);

  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };

  const JSONString = JSON.stringify(data);

  const url = `https://us14.api.mailchimp.com/3.0/lists/540b28df3b/members`;
  const options = {
    method: "POST",
    auth: "eric:b463fe285a5f83a380a47e8c28aa1714-us14",
  };

  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      let mailchimpData = JSON.parse(data);
      console.log(mailchimpData);
    });
  });
  request.write(JSONString);
  request.end();
});

app.listen(port, () => console.log(`Server running on port ${port}`));

// API KEY: b463fe285a5f83a380a47e8c28aa1714-us14
// LIST ID: 540b28df3b
