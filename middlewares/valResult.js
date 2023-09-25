import { validationResult } from "express-validator";

export default valResults = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }

  next();
};
