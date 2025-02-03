import appInit from "./server"

const port = process.env.PORT   

appInit().then((app) => {
     app.listen(port, () => {
       console.log(` app listening at http://localhost:${port}`);
     });
   });