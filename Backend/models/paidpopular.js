import {DataTypes} from 'sequelize'
import sequelize from '../config/database.js'

const Paidpopular = sequelize.define('paidpopular', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true,
    },
    displayName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    shortDescription:{
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default Paidpopular;