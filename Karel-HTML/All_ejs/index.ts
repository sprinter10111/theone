const express = require("express");
const app = express();
const ejs = require("ejs"); // EJS import

app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req: any, res: any) => {
  res.render("index");
});
app.get("/LOTR", (req: any, res: any) => {
  res.render("quiz");
});
app.get("/LOTR/1", (req: any, res: any) => {
  res.render("q1");
});
app.get("/LOTR/2", (req: any, res: any) => {
  res.render("q2");
});

app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);
