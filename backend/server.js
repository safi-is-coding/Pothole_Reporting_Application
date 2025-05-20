const dotenv = require("dotenv")
const connectDB = require("./config/dbConnection.js")
const app = require("./app.js")
const { Connection } = require("mongoose")

dotenv.config({ 
    path: "./.env" 
})

const PORT = process.env.PORT || 8000

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error) => console.log("MongoDB Connection Failed !!!", error))