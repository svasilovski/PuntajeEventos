import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { loginDbInitialized } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get(
  "/login",
  loginDbInitialized,
  (req, res, next) => {
    if (req.isAuthenticated) {
      const redirectTo = req.session.redirectTo || "/";
      return res.redirect(redirectTo);
    }
    next();
  },
  express.static(path.resolve(__dirname, "../../../login/build")),
);

router.use(
  "/login",
  express.static(path.resolve(__dirname, "../../../login/build")),
);
router.use(
  "/register",
  express.static(path.resolve(__dirname, "../../../login/build")),
);

export default router;
