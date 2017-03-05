// pushes variables found in ./env into process.env
require('dotenv').config({ path: '.env' });

// keystone will set mongoose/express dependencies for you, but
// I set them here for better control
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const keystone = require('keystone');

keystone.set('app', app);
keystone.set('mongoose', mongoose);

const env = process.env.NODE_ENV;

keystone.init({
    port: process.env.PORT || 3000,
    name: 'Split Seven',
    brand: 'Split Seven', // how are name & brand different?
    // favicon: 'public/assets/media/images/icon/favicon.ico',

    // static files
    'static': ['../public', '../data'],

    // template engine setup
    views: 'templates/views',
    'view engine': 'pug',

    // database migrations are called 'auto updating'
    'auto update': true,

    mongo: process.env.MONGO_URI,
    compress: true,
    // https://github.com/expressjs/morgan
    logger: (env === 'development' ? 'dev' : 'common'),
    session: true,
    auth: true,
    'user model': 'User',
    'cookie secret': process.env.COOKIE_SECRET,

    'wysiwyg cloudinary images': true,
    'cloudinary folders': true,
    'cloudinary config': process.env.CLOUDINARY_URL,
    'cloudinary secure': true,

});

// load project's models
// require('./models');
keystone.import('./models');

// Setup common locals for your templates. Runtime locals (that should be set
// uniquely for each request) should be added to ./routes/middleware/
keystone.set('locals', {
    // _: require('lodash'),
    // env: keystone.get('env'),
    // utils: keystone.utils,
    // editable: keystone.content.editable,
});

keystone.set('routes', require('./routes'));

keystone.start();
