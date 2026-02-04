const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const USERS_PATH = path.join(__dirname, "data/users.json");
const ACC_PATH = path.join(__dirname, "data/accounts.json");

/* ========= TOOL ========= */
function hashPassword(pw) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ========= REGISTER ========= */
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, msg: "Thiếu dữ liệu" });
  }

  const users = readJSON(USERS_PATH);
  if (users.find(u => u.username === username)) {
    return res.json({ success: false, msg: "Tài khoản đã tồn tại" });
  }

  const newUser = {
    id: Date.now(),
    username,
    password: hashPassword(password),
    balance: 0
  };

  users.push(newUser);
  writeJSON(USERS_PATH, users);

  res.json({ success: true });
});

/* ========= LOGIN ========= */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const users = readJSON(USERS_PATH);

  const hashed = hashPassword(password);
  const user = users.find(
    u => u.username === username && u.password === hashed
  );

  if (!user) {
    return res.json({ success: false, msg: "Sai tài khoản hoặc mật khẩu" });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      balance: user.balance
    }
  });
});

/* ========= BUY ACC MÙ 5K ========= */
app.post("/api/buy/acc-mu-5k", (req, res) => {
  const { userId } = req.body;

  const users = readJSON(USERS_PATH);
  const accounts = readJSON(ACC_PATH);

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.json({ success: false, msg: "User không tồn tại" });
  }

  if (user.balance < 5000) {
    return res.json({ success: false, msg: "Số dư không đủ" });
  }

  const accIndex = accounts.findIndex(
  a =>
    a.type === "acc-mu-5k" &&
    a.sold === false
);

  if (accIndex === -1) {
    return res.json({ success: false, msg: "Hết acc mù 5k" });
  }

  const acc = accounts[accIndex];
  acc.status = "sold";

  user.balance -= 5000;

  writeJSON(USERS_PATH, users);
  writeJSON(ACC_PATH, accounts);

  res.json({
    success: true,
    account: {
      username: acc.username,
      password: acc.password
    },
    balance: user.balance
  });
});

/* ========= START ========= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log("SHOP DH CÀY THUÊ RUNNING");
});
