function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function roll(rate) {
  return Math.random() < rate;
}

module.exports = { pick, roll };
