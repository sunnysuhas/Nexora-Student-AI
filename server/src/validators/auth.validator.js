export function requireFields(body, fields) {
  const missing = fields.filter((field) => !body[field]);
  if (missing.length) {
    return `${missing.join(", ")} required`;
  }
  return null;
}

export function isEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}
