import express from "express";
import { Sequelize } from "sequelize";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import sequelize from "./config/database.js";
import Person from "./models/person.js";
import Product from "./models/product.js";
import Review from "./models/review.js";
import Tag from "./models/tag.js";
import User from "./models/user.js";
import Category from "./models/category.js";
import personRouter from "./routes/person.js";
import userRouter from "./routes/user.js";
import categoryRouter from "./routes/category.js";
import authRouter from "./routes/auth.js";
import staticdataRouter from "./routes/staticdata.js";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

async function checkAndCreateDatabase() {
	try {
		// Check if the database exists
		const databaseName = sequelize.getDatabaseName();
		const query = `SELECT 1 FROM pg_database WHERE datname = '${databaseName}'`;
		const [results] = await sequelize.query(query);

		if (results.length === 0) {
			// Database does not exist, create it
			await sequelize.query(`CREATE DATABASE "${databaseName}"`);
			console.log(`Database "${databaseName}" created.`);
		} else {
			console.log(`Database "${databaseName}" exists.`);
		}
	} catch (error) {
		console.error("Error checking or creating the database:", error);
		throw error;
	}
}

async function startServer() {
	try {
		// await checkAndCreateDatabase();

		// Sync the models with the database to create the tables
		app.use(express.urlencoded({extended:true}));
		app.use(express.json()) ;
		app.use(cookieParser());
		console.log("Syncing models with the database...");
		await sequelize.sync({ alter: true }); // !!!!!! REMEMBER to remove FORCE TRUE
		console.log("Models synced successfully.");
		// app.use(bodyParser.json());

		
		console.log("Setting up passport");

		app.use(
			session({
			  secret: process.env.JWT_SECRET, // Replace with your secret key
			  resave: false,
			  saveUninitialized: true,
			  // Additional session options
			})
		  );
		app.use(passport.initialize());
		app.use(passport.session());

		app.use((req, res, next) => {
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader(
				"Access-Control-Allow-Methods",
				"GET, POST, PUT, DELETE, PATCH"
			);
			res.setHeader(
				"Access-Control-Allow-Headers",
				"Content-Type,Authorization,Origin,X-Requested-With,Accept"
			);
			next();
		});
		

		// Start the server
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (error) {
		console.error("Error starting the server:", error);
		process.exit(1); // Exit the application if an error occurs during setup
	}
}

app.use("/auth", authRouter);
app.use("/person", personRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/staticdata", staticdataRouter);

// Authenticate and start the server
sequelize
	.authenticate()
	.then(async () => {
		console.log("Database connected...");
		await startServer();
	})
	.catch((err) => {
		console.error("Error connecting to the database:", err);
		process.exit(1); // Exit the application if unable to connect to the database
	});


