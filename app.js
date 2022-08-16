const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

//LOAD CONFIG
dotenv.config({ path: './config/config.env'})

//PASSPORT CONFIG
require('./config/passport')(passport)

connectDB()

const app = express()

//Middleware. Body Parser, used to parse the infomation coming from the form
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//HANDLEBAR HELPERS
const { formatDate, stripTags, truncate, editIcon, select}= require('./helpers/hbs')


//HANDLEBAR
app.engine('.hbs', exphbs.engine({
    helpers:{
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main',
    extname: '.hbs'
    })
)
app.set('view engine', '.hbs')

//SESSIONS
app.use(
    session({
        secret:'keyboard cat',
        resave: false,
        saveUninitialized: false,
        //Ensuring that the user does not get logged out if they refreshed the page
        store:MongoStore.create({
            mongoUrl: process.env.Mongo_URI
        })
    })
)


// PASSPORT HANDLEWARE
app.use(passport.initialize())
app.use(passport.session())

//Set global variable(using middleware)
app.use(function (req, res, next){
    res.locals.user = req.user || null
    next()
}) 


//STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

//ROUTES
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on PORT ${PORT}`))