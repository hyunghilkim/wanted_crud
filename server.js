const models = require("./models");
const port = 5000;
const app = require("./app");

app.listen(port, () => {
  console.log(`${port} 서버가 잘 돌아가고 있습니다.`);
  models.sequelize
    .sync()
    .then(() => {
      console.log("✓ DB 연결 성공");
    })
    .catch((err) => {
      console.error(err);
      console.log("✗ DB 연결 에러");
      process.exit();
    });
});
