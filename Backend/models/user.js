import {DataTypes} from 'sequelize'
import sequelize from '../config/database.js'

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
        allowNull: false,
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
    },
});

User.beforeCreate(async (user) => {
    try {
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
    } catch (error) {
      throw new Error('Error hashing the password');
    }
  });

await User.sync({ alter: true });

export default User;