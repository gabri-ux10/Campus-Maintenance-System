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

  const requirements = [
    { id: "minLength", label: "At least 10 characters", met: checks.minLength },
    { id: "hasUpper", label: "Uppercase letter", met: checks.hasUpper },
    { id: "hasLower", label: "Lowercase letter", met: checks.hasLower },
    { id: "hasDigit", label: "Number", met: checks.hasDigit },
    { id: "hasSymbol", label: "Special character", met: checks.hasSymbol },
    { id: "noWhitespace", label: "No spaces", met: checks.noWhitespace },
    { id: "notCommon", label: "Not a common password", met: checks.notCommon },
    { id: "noPersonalInfo", label: "Does not include your personal details", met: checks.noPersonalInfo },
  ];

  const valid =
    checks.minLength &&
    checks.hasLower &&
    checks.hasUpper &&
    checks.hasDigit &&
    checks.hasSymbol &&
    checks.noWhitespace &&
    checks.notCommon &&
    checks.noPersonalInfo;

  const metCount = requirements.filter((requirement) => requirement.met).length;
  let score = value ? Math.max(1, Math.round((metCount / requirements.length) * 5)) : 0;
  if (value.length >= 14 && classes === 4) {
    score = Math.min(5, score + 1);
  }

  let level = "low";
  if (valid && score >= 5) {
    level = "high";
  } else if (score >= 3) {
    level = "medium";
  }

  const messages = requirements.filter((requirement) => !requirement.met).map((requirement) => requirement.label);

  return { valid, level, checks, messages, requirements, score };
};
