require("dotenv").config()
const express = require("express")
const cors = require("cors");
require("./mongooseConnection")

const app = express()
// Enable CORS for all routes
app.use(cors());

// To configure CORS with specific settings:
app.use(cors({
    origin: '*', // Allow all origins or specify the allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Specify allowed headers
}));

app.use(express.json())

//store files image and pdf
app.use('/image', express.static('image'))
app.use('/pdfFile', express.static('pdfFile'))

const loginRoute = require("./router/loginRouter")
app.use(loginRoute)

const profileRoute = require("./router/profileRouter")
app.use(profileRoute)

const WorkProfileRoute = require("./router/workDetailRouter")
app.use(WorkProfileRoute)

const DisplayRoute = require("./router/displayRouter")
app.use(DisplayRoute)

const HireRoute = require("./router/hireRequestRouter")
app.use(HireRoute)

const port = process.env.PORT

app.listen(port, () => {
    console.log("server port :: " + port);
})
