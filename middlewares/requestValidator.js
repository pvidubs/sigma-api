import parsePhoneNumber from "libphonenumber-js";
import { body, validationResult, param } from "express-validator";
import { provinceList } from "../utils/provinceList.js";

const valResults = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};

const codeRegex = /^\+\d{1,3}$/;
const phoneNumberRegex = /^\+\d+$/;

export const clientValidator = [
  body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
  body("password", "Invalid Password").trim().isLength({ min: 6, max: 16 }),
  body("password").custom((value, { req }) => {
    if (value !== req.body.repassword) {
      throw new Error("No Matched Passwords");
    }
    return value;
  }),
  body("username", "Invalid Username")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 3, max: 20 }),
  valResults,
];

export const agentValidator = [
  body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
  body("password", "Invalid Password").trim().isLength({ min: 6, max: 16 }),
  body("password").custom((value, { req }) => {
    if (value !== req.body.repassword) {
      throw new Error("No Matched Passwords");
    }
    return value;
  }),
  body("firstname", "Invalid First Name")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 1, max: 30 }),
  body("lastname", "Invalid Last Name")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 1, max: 30 }),
  body("code", "Invalid Code").trim().matches(codeRegex),
  body("phone").custom((value, { req }) => {
    const parsedNumber = parsePhoneNumber(req.body.code + value);
    if (!parsedNumber.isValid()) throw new Error("Invalid Phone Number");
    return value;
  }),
  body("bio", "Invalid Bio").optional().trim().isLength({ max: 160 }),
  body("public_email", "Invalid Public Email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .normalizeEmail(),
  valResults,
];

export const loginValidator = [
  body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
  body("password", "Invalid Password").trim().isLength({ min: 6, max: 16 }),
  valResults,
];

export const updateClientValidator = [
  body("username", "Invalid Username")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 3, max: 20 }),
  valResults,
];

export const updateAgentValidator = [
  body("firstname", "Invalid First Name")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 1, max: 30 }),
  body("lastname", "Invalid Last Name")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 1, max: 30 }),
  body("code", "Invalid Code").trim().matches(codeRegex),
  body("phone").custom((value, { req }) => {
    const parsedNumber = parsePhoneNumber(req.body.code + value);
    console.log(parsedNumber.isValid());
    if (!parsedNumber.isValid()) throw new Error("Invalid Phone Number");
  }),
  body("bio", "Invalid Bio").optional().trim().isLength({ max: 160 }),
  body("public_email", "Invalid Public Email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .normalizeEmail(),
  valResults,
];

export const paramValidator = [
  param("id", "Invalid ID Format").trim().notEmpty().escape(),
  valResults,
];

export const postValidator = [
  body("type").custom((value) => {
    if (value !== "sale" && value !== "rent") {
      throw new Error("Invalid Type");
    }
    return value;
  }),
  body("province").custom((value) => {
    if (!provinceList.hasOwnProperty(value)) {
      throw new Error("Invalid Province");
    }
    return value;
  }),
  body("municipality").custom((value, { req }) => {
    if (!provinceList[req.body.province].includes(value)) {
      throw new Error("Invalid Municipality");
    }
    return value;
  }),
  body("bed_room", "Invalid Bed_Room").isNumeric().isInt({ min: 0, max: 5 }),
  body("bath_room", "Invalid Bath_Room").isNumeric().isInt({ min: 0, max: 5 }),
  body("garage", "Invalid Garage").isBoolean(),
  body("garden", "Invalid Garden").isBoolean(),
  body("pool", "Invalid Pool").isBoolean(),
  body("furnished", "Invalid Furnished").isBoolean(),
  body("phone", "Invalid Phone Format").trim().matches(phoneNumberRegex),
  body("phone").custom((value) => {
    const phoneNumber = parsePhoneNumber(value); // Format expected: '+12133734253'
    if (!phoneNumber.isValid()) throw new Error("Invalid Phone Number");
    return value;
  }),
  body("description", "Invalid Description").optional().trim().isLength({ max: 160 }),
  body("currency").custom((value) => {
    if (value !== "mn" && value !== "usd") {
      throw new Error("Invalid Currency");
    }
    return value;
  }),
  body("frequency")
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (value !== "daily" && value !== "monthly") {
        throw new Error("Invalid Frequency");
      }
      return value;
    }),
  body("amount", "Invalid Amount").isNumeric().isInt({ min: 1 }),
  valResults,
];
