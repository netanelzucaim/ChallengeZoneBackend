import appInit from "./server";
import https from "https";
import fs from "fs";
import path from "path";

const port = process.env.PORT;

appInit().then((app) => {
    if (process.env.NODE_ENV != "production") {
        app.listen(port, () => {
            console.log(`dev environment running at http://localhost:${port}`);
        });
    } else {
        console.log("success");
        const prop = {
            key: fs.readFileSync(path.join(__dirname, "../../server.key")), // Adjust the path
            cert: fs.readFileSync(path.join(__dirname, "../../server.crt")) // Adjust the path
        };
        https.createServer(prop, app).listen(port, () => {
                   console.log(`production environment running at https://localhost:${port}`);
       });
    }
});
