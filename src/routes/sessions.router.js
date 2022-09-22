import { Router } from "express";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/registerfail",
  }),
  async (req, res) => {
    // I pass the name of my custonm strategy to "authenticate".
    // The big objective of passport is to return a req.user.
    res.send({ status: "success", payload: req.user._id });
  }
);

router.get("/registerfail", (req, res) => {
  res
    .status(500)
    .send({ status: "error", error: "Error ocurred while registering a user" });
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginfail",
  }),
  async (req, res) => {
    req.session.user = {
      // We build the user session without the sensible details.
      name: req.user.name,
      email: req.user.email,
      id: req.user._id,
    };
    res.redirect("/");
  }
);

router.get("/loginfail", (req, res) => {
  res.status(500).send({ status: "error", error: "Error in login" });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: [] }),
  (res, req) => {
    // This is the enpoint that takes me to the github authenticator.
  }
);

router.get("/githubcallback", passport.authenticate("github"), (req, res) => {
  req.session.user = {
    name: req.user.name,
    email: req.user.email,
    id: req.user._id,
  };
  res.redirect("/current");
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error)
      return res.status(500).send({
        status: "error",
        message: "Could not logout, please try again!",
      });
  });
  res.redirect("/login");
});

export default router;
