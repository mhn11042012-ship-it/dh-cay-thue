const express = require("express");
const fs = require("fs");
const path = require("path");
const { pick, roll } = require("../utils/random");

const router = express.Router();

const accPath = path.join(__dirname, "../data/accounts.json");
const soldPath = path.join(__dirname, "../data/sold.json");

router.post("/buy", (req, res) => {
  const { tier } = req.body;

  const accs = JSON.parse(fs.readFileSync(accPath));
  const sold = JSON.parse(fs.readFileSync(soldPath));

  const list = accs.filter(a => a.tier === tier);
  if (!list.length) {
    return res.json({ ok: false, msg: "Hết acc tier này" });
  }

  const acc = pick(list);

  const remain = accs.filter(a => a.id !== acc.id);
  sold.push({ ...acc, time: Date.now() });

  fs.writeFileSync(accPath, JSON.stringify(remain, null, 2));
  fs.writeFileSync(soldPath, JSON.stringify(sold, null, 2));

  let bonus = {};
  if (acc.chance?.blood_demon_art) {
    bonus.blood_demon_art = roll(acc.chance.blood_demon_art);
  }

  res.json({
    ok: true,
    acc: acc.data,
    bonus
  });
});

module.exports = router;
