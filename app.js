// import modules for http post request
import express from "express";
import fileURLToPath from "path";
import url from "url";
import { dirname } from "path";
import https from "https";

// create express app and set port
const app = express();
const port = 3000;

// setup path for html files
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// middleware for handling json and urlencoded requests and serving static files from the current directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// make a GET request to serve the signup.html file when the root path is accessed
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

// make a POST request to send data to Mailchimp API for adding a new subscriber
app.post("/", (req, res) => {
  const { firstName, lastName, email } = req.body;

  // The structure of this data is based on the Mailchimp API documentation: https://mailchimp.com/developer/reference/lists/members/
  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };

  // convert the data to JSON format and set the required headers for the POST request to the Mailchimp API
  const jsonData = JSON.stringify(data);
  const url = "https://us14.api.mailchimp.com/3.0/lists/540b28df3b/members";
  const options = {
    method: "POST",
    auth: "ericOnah:b463fe285a5f83a380a47e8c28aa1714-us14",
  };

  // set up the request and handle the response from the Mailchimp API
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      const mailData = JSON.parse(data);
      console.log(mailData);
    });
  });
  // send the request with the data
  request.write(jsonData);
  // end the request
  request.end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
