const express = require('express');
const path = require('path');
const index = require('./routes/index');
const errors = require('./routes/errors');
require('dotenv').config();

// Initializing Express App
const app = express();

// register view engine + Define Views folder
app.set('view engine', 'ejs');
app.set('views', './views');

// Static Files
app.use(express.static(path.join(__dirname,'public')));

// Body Parser
app.use(express.urlencoded({ extended: true }));

// Main Router
app.use('/', index);

// Handle 404 Errors
app.use(errors);

app.listen(process.env.PORT, () => {
   console.log(`App running on http://localhost:${process.env.PORT} (${process.env.ENV})`);
});