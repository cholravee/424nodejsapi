const http = require("http");
const express = require("express");
const https = require('https')
const path = require('path')
const fs = require('fs')
const bodyParser = require("body-parser");
const cors = require('cors');

const routes = require("./routes.js")

const app = express();

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
},app)


const corsOptions = {
    origin: '*',
    credentials: true,
  };
  app.use(cors(corsOptions));
// const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))




try{
   sslServer.listen(4000, () => console.log('SSL Server on port 4000!!!'))

    app.use("/auth", routes);

} catch (err) {
    console.log("err",err);
}

const onClose = () => {
    process.exit();
};

process.on("SIGTERM", onClose);
process.on("SIGINT", onClose);
process.on("uncaughtException", onClose);


