module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  });
  Posts.associate = (models) => {
    Posts.belongsTo(models.Users, {
      as: "Owner",
      foreignKey: "user_id",
      targetKey: "id",
    });
  };
  return Posts;
};
