import passport from "passport";
import local from "passport-local";
import usersService from "../models/Users.js";
import { createHash, isValidPassword } from "../utils.js";
import GithubStrategy from "passport-github2";

// We use passport to migrate all the register structure and login into just one file.
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        // If I didnt specify the usernameField, then i put "username" instead of "email"
        try {
          const { name } = req.body;
          if (!name || !email || !password)
            return done(null, false, { message: "Incomplete form fields" });
          // Is the user already in the database?
          const exists = await usersService.findOne({ email: email });
          // This is the unique field that i am requesting
          if (exists)
            return done(null, false, { message: "User already exists" });
          // Once we probe the user does not exist in our database we insert it.
          const newUser = {
            name,
            email,
            password: createHash(password),
          };
          let result = await usersService.create(newUser);
          // If everything goes good with strategy:
          return done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          if (!email || !password)
            return done(null, false, { message: "Incomplete login fields" });
          let user = await usersService.findOne({ email: email });
          if (!user)
            return done(null, false, { message: "Incorrect credentials" });
          if (!isValidPassword(user, password))
            return done(null, false, { message: "Incorrect password" });
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.1e430cb479eebf41",
        clientSecret: "538df69c26160660924aa7c8d01b3e2e624f0d7f",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // Extract data from the profile:
        const { name, email } = profile._json;
        // Exists in database?:
        let user = await usersService.findOne({ email: email });
        if (!user) {
          // Create the userName
          let newUser = {
            name,
            email,
            password: "", //This means it is not an normal authentication, it is a third party authentication.
          };
          let result = await usersService.create(newUser);
          return done(null, result);
        } else {
          // If we enter into this else, is because we finded the user:
          return done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    // Serialization is to convert into an id in order to have a reference of the user:
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let result = await usersService.findOne({ _id: id });
    return done(null, result);
  });
};

export default initializePassport;
