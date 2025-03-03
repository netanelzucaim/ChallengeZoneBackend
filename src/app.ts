import appInit from "./server"
import https from "https"
import fs from "fs"

const port = process.env.PORT;

appInit().then((app) => {
     app.listen(port, () => {
      if (process.env.NODE_ENV != "production") {
        app.listen(port, () => {
          console.log(`Example app listening at http://localhost:${port}`);
        });
      } else {
        console.log("succcess")
        const prop = {
          key: fs.readFileSync("client-key.pem"),
          cert: fs.readFileSync("client-cert.pem")
        }
        https.createServer(prop, app).listen(port)
      }
     });
   });