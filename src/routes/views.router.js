import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  if (req.session.user)
    return res.render("current", { user: req.session.user });
  res.render("login");
});

router.get("/register", (req, res) => {
  if (req.session.user)
    return res.render("current", { user: req.session.user });
  res.render("register");
});

router.get("/login", (req, res) => {
  if (req.session.user)
    return res.render("current", { user: req.session.user });
  res.render("login");
});

router.get("/current", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("current", { user: req.session.user });
});

export default router;
