module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  });
  // 제품 모델 관계도
  Users.associate = (models) => {
    // 메모 모델에 외부키를 건다
    // onDelete 옵션의 경우 제품 하나가 삭제되면 외부키가 걸린 메모들도 싹다 삭제해준다 단 sync를 다시 해줘야됨
    // as 의 경우 모델명과 똑같이 하지 않는다 Products (x)
    Users.hasMany(models.Posts, {
      as: "Posts",
      foreignKey: "user_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
  };
  return Users;
};
