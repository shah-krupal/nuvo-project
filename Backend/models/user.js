import {DataTypes} from 'sequelize'
import sequelize from '../config/database.js'
import bcrypt from 'bcrypt';

const User = sequelize.define('user', {
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey:true,
        unique: true
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    googleId:{
        type: DataTypes.STRING,
        allowNull: true,
    }
});

User.beforeCreate(async (user) => {
    try {
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
    } catch (error) {
      throw new Error('Error hashing the password: ' + error.message);
    }
  });

await User.sync({ alter: true });

export default User;