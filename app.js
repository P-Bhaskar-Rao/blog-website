require("dotenv").config()
const express = require("express");
const app = express();
const path=require("path")
const mongoose = require("mongoose");
const Blog=require("./models/blog")
const userRoute = require("./routes/user");
const blogRoute=require("./routes/blog")

const cookieParser=require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const User = require("./models/user");
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected!!"));

app.set("view engine", "ejs");
app.set("views", "./views");    

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')))
app.use(checkForAuthenticationCookie("token"))


app.get("/", async(req, res) => {
  const allBlogs=await Blog.find({})
  let username=""
  if(req.user){
    const user=await User.findById(req.user._id)
    username=user.fullName
  }
  
  res.render("home",{
    user:req.user,
    blogs:allBlogs,
    username
  });
});

app.use("/user", userRoute);
app.use("/blog",blogRoute)
app.listen(PORT, () => {
  console.log(`Serever is running on port ${PORT}`);
});
