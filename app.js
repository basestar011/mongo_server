const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('./src/config/morgan');
const checkAuth = require('./src/utils/checkAuth');
const auth = require('./src/routes/auth');
const categories = require('./src/routes/categories');
const users = require('./src/routes/users')
const mongoose = require('mongoose');

/** set environment if necessary */
process.env.NODE_ENV === 'local' && dotenv.config({ path: __dirname + '/.env' });

const app = express();

/** set middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan());
app.use(cors());

/** connect mongodb */
const uri =
  `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PW}@${process.env.DB_CLUSTER_URL}?retryWrites=true&writeConcern=majority`;
mongoose.connect(uri, { useNewUrlParser: true })
.then(console.log('mongodb connected')).catch(console.error);


/** set routes */
app.use('/auth', auth);
app.use('/categories', checkAuth, categories);
app.use('/users', users);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`express server on port ${port}`));