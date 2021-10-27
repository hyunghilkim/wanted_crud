const express = require("express");
const auth = require("../middleware/auth");
const paginate = require("express-paginate");
const router = express.Router();

// model
const Post = require("../models").Posts;

// @routes     GET /posts
// @desc       글 목록 확인 [pagination]
// @access     public
router.get("/products", paginate.middleware(10, 100), (req, res) => {
  Promise.all([
    models.Products.findAll({
      include: [
        {
          model: models.User,
          as: "Owner",
          attributes: ["username", "displayname"],
        },
      ],
      order: [["createdAt", "desc"]],
      limit: req.query.limit,
      offset: req.offset,
    }),
    models.Products.count(),
  ])
    .then(([products, totalCount]) => {
      const pageCount = Math.ceil(totalCount / req.query.limit);
      const pages = paginate.getArrayPages(req)(5, pageCount, req.query.page);
      res.json({ products, pages, pageCount });
    })
    .catch((e) => {
      console.error(e);
      res.send("게시글 목록 확인에 문제가 발생 했습니다.");
    });
});

// @routes     POST /posts/write
// @desc       글 작성
// @access     user
router.post("/write", auth, (req, res) => {
  const { title, content, nickname } = req.body;
  // 간단한 유효성 검사
  if (!title || !content || !nickname) {
    return res.status(400).json({ message: "모든 필드를 채워주세요" });
  }
  Post.create({ title, content, nickname })
    .then(({ title, content, nickname, id }) => {
      res.json({
        title,
        content,
        nickname,
        id,
      });
    })
    .catch((e) => {
      console.error(e);
      res.send("게시글 작성에 문제가 발생 했습니다.");
    });
});

// @routes     GET /posts/detail/:id
// @desc       글 확인
// @access     public
router.get("/detail/:id", (req, res) => {
  Post.findByPk(req.params.id)
    .then(({ title, content, nickname, id }) => {
      res.json({
        title,
        content,
        nickname,
        id,
      });
    })
    .catch((e) => {
      console.error(e);
      res.send("게시글 확인에 문제가 발생 했습니다.");
    });
});

// @routes     GET /posts/delete/:id
// @desc       글 삭제
// @access     user
router.get("/delete/:id", auth, (req, res) => {
  Post.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.send("게시물 삭제 완료");
    })
    .catch((e) => {
      console.error(e);
      res.send("게시글 삭제에 문제가 발생 했습니다.");
    });
});

// @routes     GET /posts/edit/:id
// @desc       글 수정
// @access     user
router.post("/edit/:id", auth, (req, res) => {
  const { title, content, nickname } = req.body;
  Post.update({ title, content, nickname }, { where: { id: req.params.id } })
    .then(() => {
      res.send("게시물 수정 완료");
    })
    .catch((e) => {
      console.error(e);
      res.send("게시글 수정에 문제가 발생 했습니다.");
    });
});

module.exports = router;
