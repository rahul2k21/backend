const express = require('express');
const cors = require("cors");
const connection = require("./configuration/dbConfig"); 
const userRouter = require('./routes/usersRouter'); 
const authRouter = require('./routes/authRouter'); 
const app = express();

connection();
const PORT = process.env.PORT || 8082;
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter); 
app.use("/api/users", userRouter); 

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Server is up and running...",
    });
});

app.listen(PORT, () => {
    console.log(`server is running on :http://localhost:${PORT}`);
});


