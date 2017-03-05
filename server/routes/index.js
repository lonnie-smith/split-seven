const keystone = require('keystone');
const middleware = require('../middleware/middleware');
const importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', (req, res, next) => {
    res.notfound();
});

// Handle other errors
keystone.set('500', (err, req, res, next) => {
    let title;
    let message;
    let lclErr = err;
    if (err instanceof Error) {
        message = err.message;
        lclErr = err.stack;
        console.log(err);
    }
    res.err(lclErr, title, message);
});

// Load Routes
const routes = {
    views: importRoutes('./views'),
};

// Bind Routes
module.exports = app => {
    // app is the express app. Anything you can do in express, you can do here.
    app.get('/', routes.views.index);
    app.get('/set-list/:setList', routes.views.setList);
};
