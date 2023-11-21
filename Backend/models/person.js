import {DataTypes} from 'sequelize'
import sequelize from '../config/database.js'

const Person = sequelize.define('person', {
    personId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey:true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    profileUrl:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    role:{
        type: DataTypes.STRING,
        allowNull: true
    },
    bio:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    linkedinUrl:{
        type: DataTypes.STRING,
        allowNull: true
    },
    twitterUrl:{
        type: DataTypes.STRING,
        allowNull: true
    },
    productReferences:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
    }
});

await Person.sync({alter:true});

export default Person;