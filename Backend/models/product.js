import {DataTypes} from 'sequelize'
import sequelize from '../config/database.js'
import Category from './category.js';

const Product = sequelize.define('product', {
    productId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true
    },
    name: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    shortDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    iconUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    websiteUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    overview: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    features: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    screenshots: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
            isValidCategoryArray(value) {
              if (!Array.isArray(value)) {
                throw new Error('Category must be an array of strings');
              }
      
            //   Check if all values in the category array exist in the Categories table
              return Promise.all(
                value.map((categoryName) => {
                  return Category.findOne({ where: { categoryName: categoryName } }).then((category) => {
                    if (!category) {
                      throw new Error(`Invalid category: ${categoryName}`);
                    }
                  });
                })
              );
            }
        }
    },
    tags:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    teamMembers:{
        type: DataTypes.ARRAY(DataTypes.INTEGER), 
        allowNull: false
    },
    counter:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
})
await Product.sync()

export default Product 