/** load environment variables first */
const dotenv = require('dotenv');
process.env.NODE_ENV && dotenv.config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` });

/** import module */
const express = require('express');
const cors = require('cors');
const morgan = require('./src/config/morgan');
const checkAuth = require('./src/utils/checkAuth');
const auth = require('./src/routes/auth');
const categories = require('./src/routes/categories');
const contents = require('./src/routes/contents')
const users = require('./src/routes/users');
const external = require('./src/routes/external');
const mongoose = require('mongoose');

const app = express();

/** set middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan());
app.use(cors());

/** connect mongodb */
const uri =
  `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PW}@${process.env.DB_CLUSTER_URL}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true })
.then(console.log('mongodb connected')).catch(console.error);


/** set routes */
app.use('/auth', auth);
app.use('/categories', checkAuth, categories);
app.use('/contents', checkAuth, contents);
app.use('/users', users);
app.use('/external', checkAuth, external);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`express server on port ${port}`));