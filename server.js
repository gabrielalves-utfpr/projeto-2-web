const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/login', require("./routes/login"))
app.use('/user', require("./control/UserAPI"))
app.use('/admin', require("./control/AdminAPI"))
app.use('/product', require("./control/ProductAPI"))
app.use('/categorie', require("./control/CategorieAPI"))
app.use('/supplier', require("./control/SupplierAPI"))
app.use('/install', require("./control/InstallAPI"))

app.listen(3000, () => {
    console.log('Working... http://localhost:3000')
})