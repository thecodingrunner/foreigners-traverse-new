const { randomBytes } = require("crypto");
const r = () => randomBytes(32).toString("base64");

console.log(`APP_KEYS=${[r(), r(), r(), r()].join(",")}`);
console.log(`API_TOKEN_SALT=${r()}`);
console.log(`ADMIN_JWT_SECRET=${r()}`);
console.log(`TRANSFER_TOKEN_SALT=${r()}`);
console.log(`JWT_SECRET=${r()}`);
console.log(`ENCRYPTION_KEY=${r()}`);