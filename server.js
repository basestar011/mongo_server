const express = require('express');
const morgan = require('./config/morgan');
const cors = require('cors');

/** set environment if necessary */
process.env.NODE_ENV === 'local' && require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

/** set middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan());
app.use(cors());

/** set routes */
const auth = require('./auth');
app.use('/auth', auth);

const checkAuth = require('./checkAuth').checkAuth;
const categories = require('./categories');
app.use('/categories', checkAuth, categories);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`express server on port ${port}`));