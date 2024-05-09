const path = require("path");
const fs = require("fs");

const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);
const helmet = require("helmet");
const compression = require("compression");

const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
  })
);
// app.options("*", cors());

app.use(express.json());
app.use(cookieParser("secretKey"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const errorController = require("./controllers/error");
const User = require("./models/user");

const dbConnect = require("./db/dbConnect");
dbConnect();

// Store session on DB
const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(helmet());
app.use(compression());

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: false,
    },
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  try {
    const user = User.findById(req.session.user._id);
    req.user = user;
    return next();
  } catch (error) {
    throw new Error(error);
  }
});

//Route for Admin and Products page
app.use(authRoutes);
app.use(adminRoutes);
app.use(productRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const server = app.listen(process.env.PORT || 5000);
const io = require("./socket").init(server);
io.on("connection", (socket) => {
  console.log("Client connected");
});
