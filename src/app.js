import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";

const app = express();
const connection = mongoose.connect(
  "mongodb+srv://joaquingarese:1a2b3c@cluster0.dcv0epl.mongodb.net/?retryWrites=true&w=majority",
  (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Atlas DB connected");
    }
  }
);
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://joaquingarese:1a2b3c@cluster0.dcv0epl.mongodb.net/?retryWrites=true&w=majority",
      ttl: 600,
    }),
    secret: "C0derSessi0n3000",
    resave: false,
    saveUninitialized: false,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);

const server = app.listen(8080, () => {
  console.log("Listening on 8080! ");
});
