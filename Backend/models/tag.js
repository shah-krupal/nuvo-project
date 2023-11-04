import {DataTypes} from 'sequelize'
import sequelize from '../config/database.js'

const Tag = sequelize.define('tag', {
    tagId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

await Tag.sync();

export default Tag;