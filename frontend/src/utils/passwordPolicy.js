const COMMON_PASSWORDS = new Set([
  "password",
  "password123",
  "12345678",
  "qwerty123",
  "letmein",
  "welcome1",
  "admin123",
  "iloveyou",
]);

const hasLower = (value) => /[a-z]/.test(value);
const hasUpper = (value) => /[A-Z]/.test(value);
const hasDigit = (value) => /[0-9]/.test(value);
const hasSymbol = (value) => /[^A-Za-z0-9]/.test(value);
const hasWhitespace = (value) => /\s/.test(value);

const tokenSet = (username, email, fullName) => {
  const set = new Set();
  const push = (value) => {
    if (!value) return;
    const normalized = value.trim().toLowerCase();
    if (normalized.length >= 3) set.add(normalized);
  };
  push(username);
  if (email) push(email.split("@")[0]);
  if (fullName) {
    fullName
      .trim()
      .split(/\s+/)
      .forEach(push);
  }
  return set;
};

export const evaluatePassword = (password, { username = "", email = "", fullName = "" } = {}) => {
  const value = password || "";
  const lower = hasLower(value);
  const upper = hasUpper(value);
  const digit = hasDigit(value);
  const symbol = hasSymbol(value);
  const classes = [lower, upper, digit, symbol].filter(Boolean).length;

  const identityTokenHit = [...tokenSet(username, email, fullName)].some((token) =>
    value.toLowerCase().includes(token)
  );

  const checks = {
    minLength: value.length >= 10,
    hasLower: lower,
    hasUpper: upper,
    hasDigit: digit,
    hasSymbol: symbol,
    noWhitespace: !hasWhitespace(value),
    notCommon: !COMMON_PASSWORDS.has(value.toLowerCase()),
    noPersonalInfo: !identityTokenHit,
  };

  let level = "low";
  if (value.length >= 14 && classes === 4 && checks.noPersonalInfo && checks.notCommon) {
    level = "high";
  } else if (value.length >= 10 && classes >= 3) {
    level = "medium";
  }

  const valid =
    checks.minLength &&
    checks.hasLower &&
    checks.hasUpper &&
    checks.hasDigit &&
    checks.hasSymbol &&
    checks.noWhitespace &&
    checks.notCommon &&
    checks.noPersonalInfo;

  const messages = [];
  if (!checks.minLength) messages.push("At least 10 characters");
  if (!(checks.hasLower && checks.hasUpper && checks.hasDigit && checks.hasSymbol)) {
    messages.push("Use uppercase, lowercase, number, and symbol");
  }
  if (!checks.noWhitespace) messages.push("No spaces allowed");
  if (!checks.notCommon) messages.push("Password is too common");
  if (!checks.noPersonalInfo) messages.push("Avoid personal identifiers");

  return { valid, level, checks, messages };
};
