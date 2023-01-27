const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require("cors");
const session = require('express-session');
const passport = require("passport");
var cron = require('node-cron');
const authRoute = require("./routes/auth");
const wallet = require("./routes/wallet")
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const autoserial = require("./routes/theautoserial")
const deposit = require("./routes/deposit")
const history = require("./routes/historis")
const pdertt = require("./routes/pdertt")

require('./passport');

app.use(express.json());

const port = process.env.PORT || 9000;
dotenv.config();

app.use(
    cors({
        origin: "*", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // allow session cookie from browser to pass through
    })
);

app.use(session({
    secret: "sdfghjkl",
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
.then(() =>console.log('connected!'))
.catch((e) =>console.error('faild'+ e));


app.use("/api/auth", authRoute);
app.use("/api/wallet", wallet);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/deposit", deposit);
app.use("/api/history", history);
app.use("/api/pdertt", pdertt);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

