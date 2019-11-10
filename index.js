const express = require("express");
const app = express();

app.use((req, res) => {
    res.send("Hello world!!!");
});
app.listen(process.env.PORT || 8001, () => {
    console.log("Server is started")
});