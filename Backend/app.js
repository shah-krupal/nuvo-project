import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import personRouter from "./routes/person.js";
import userRouter from "./routes/user.js";
import categoryRouter from "./routes/category.js";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

app.use(express.urlencoded({extended:true}));
app.use(express.json()) ;
app.use(cookieParser());

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


app.post("/login", (req, res) => {
    console.log(req.body);
    res.send("Login successful");
});


sequelize.authenticate().then(() => {
    console.log("Database connected...");
}).catch((err) => {
    console.log("Error:::: " + err);
    process.exit(1);
}) ;

app.use("/auth", authRouter);
app.use("/person", personRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

