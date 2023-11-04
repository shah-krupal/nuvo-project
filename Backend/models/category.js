import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define("category", {
	categoryId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	categoryName: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	iconUrl: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	preferred: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
});

// await Category.sync({ alter: true });
await Category.sync();

export default Category;
