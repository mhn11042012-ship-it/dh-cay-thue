let currentUser = null;

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");
const shopBox = document.getElementById("shopBox");
const header = document.getElementById("header");
const sideMenu = document.getElementById("sideMenu");

function showRegister() {
  loginBox.style.display = "none";
  registerBox.style.display = "block";
}

function showLogin() {
  registerBox.style.display = "none";
  loginBox.style.display = "block";
}

/* REGISTER */
async function register() {
  const username = regUser.value;
  const password = regPass.value;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  registerStatus.innerText = data.msg || "Đăng ký thành công";

  if (data.success) showLogin();
}

/* LOGIN */
async function login() {
  const username = loginUser.value;
  const password = loginPass.value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (!data.success) {
    loginStatus.innerText = data.msg;
    return;
  }

  currentUser = data.user;

  header.style.display = "flex";
  loginBox.style.display = "none";
  shopBox.style.display = "block";

  uid.innerText = currentUser.id;
  balance.innerText = currentUser.balance;
}

/* BUY ACC */
async function buyAcc() {
  const res = await fetch("/api/buy/acc-mu-5k", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: currentUser.id })
  });

  const data = await res.json();

  if (!data.success) {
    alert(data.msg);
    return;
  }

  // cập nhật số dư
  balance.innerText = data.balance;

  // hiện khung kết quả
  document.getElementById("buyResult").style.display = "block";

  // đổ acc vào HTML
  document.getElementById("acc-user").innerText = data.account.username;
  document.getElementById("acc-pass").innerText = data.account.password;
}

/* MENU */
function toggleMenu() {
  sideMenu.classList.toggle("show");
}

function logout() {
  location.reload();
}
// ===== COPY TEXT =====
function copyText(id) {
  const el = document.getElementById(id);
  if (!el) {
    alert("Không tìm thấy nội dung để copy");
    return;
  }

  const text = el.innerText;

  navigator.clipboard.writeText(text).then(() => {
    alert("Đã sao chép: " + text);
  }).catch(() => {
    // fallback cho Android / trình duyệt cũ
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    alert("Đã sao chép: " + text);
  });
}
