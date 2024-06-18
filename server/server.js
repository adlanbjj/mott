const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectToDatabase } = require("./db");
const authRoutes = require("./routes/authRoutes"); 
const wordsRoutes = require("./routes/wordsRoutes"); 
const postsRoutes = require("./routes/postsRoutes"); 
const messageRoutes = require("./routes/messageRoutes"); 
const cookieParser = require("cookie-parser");


const app = express();


const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




app.use("/auth", authRoutes);
app.use('/words', wordsRoutes);
app.use("/posts", postsRoutes);
app.use("/messages", messageRoutes);



async function main() {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error);

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}