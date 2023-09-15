import {DataTypes} from 'sequelize'
import sequelize from '../config/database.js'

const Review = sequelize.define('review', {
    reviewId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true
    },
    productId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    personId:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating:{
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    reviewText:{
        type: DataTypes.TEXT,
        allowNull: true
    }
});

await Review.sync({ alter: true });

export default Review;