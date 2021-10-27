const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// jwt secret key
const JWT_SECRET = "wanted";

// model
const User = require("../models").Users;

// @routes     POST auth/signup
// @desc       회원가입
// @access     public
router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  // 간단한 유효성 검사
  if (!email || !password) {
    return res.status(400).json({ message: "모든 필드를 채워주세요" });
  }
  // 유저가 존재하는지 검사
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ message: "이미 가입된 유저가 존재합니다" });
      }

      // 비밀번호 인코딩
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          User.create({ email: email, password: hash })
            .then((user) => {
              jwt.sign(
                { id: user.id },
                JWT_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) throw err;
                  res.json({
                    token,
                    user: {
                      id: user.id,
                      email: user.email,
                    },
                  });
                }
              );
            })
            .catch((e) => {
              console.error(e);
              res.send("회원가입에 문제가 발생했습니다.");
            });
        });
      });
    })
    .catch((e) => console.error(e));
});

// @routes     POST auth/login
// @desc       로그인
// @access     public
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // 간단한 유효성 검사
  if (!email || !password) {
    return res.status(400).json({ msg: "모든 필드를 채워주세요" });
  }
  // 유저 존재 여부 확인
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "유저가 존재하지 않습니다" });

    // 비밀번호 비교
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({ msg: "비밀번호가 일치하지 않습니다" });
      jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: "2 days" },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              email: user.email,
            },
          });
        }
      );
    });
  });
});

// @routes     GET auth/logout
// @desc       로그아웃
// @access     user
router.get("/logout", (req, res) => {
  res.json("로그아웃 성공");
});

module.exports = router;
