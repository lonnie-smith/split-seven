// catch all file for simple/short middleware functions
const _ = require('lodash');
const keystone = require('keystone');

/*
    Initialises the standard view locals.
    Include anything that should be initialised before route controllers are executed.
*/
module.exports.initLocals = (req, res, next) => {
    console.log('----', req.url)
    const locals = res.locals;
    locals.user = req.user;
    locals.mkImgUrl = mkCldUrl;
    // Add your own local variables here
    next();
};

/*
    Inits the error handler functions into `res`
*/
module.exports.initErrorHandlers = (req, res, next) => {
    res.err = (err, title, message) => {
        res.status(500).render('errors/500', {
            err,
            errorTitle: title,
            errorMsg: message,
        });
    };

    res.notfound = (title, message) => {
        res.status(404).render('errors/404', {
            errorTitle: title,
            errorMsg: message,
        });
    };
    next();
};

/*
    Fetches and clears the flashMessages before a view is rendered

    Flash messages are used in route controllers like this:
    req.flash('warning', 'here is a warning message');

    This setup has 4 types of flash messages by default.

    See /templates/mixins/flash-messages.pug for markup.
*/
module.exports.flashMessages = (req, res, next) => {
    const flashMessages = {
        info: req.flash('info'),
        success: req.flash('success'),
        warning: req.flash('warning'),
        error: req.flash('error'),
    };
    res.locals.messages = _.some(flashMessages, (msgs) => { return msgs.length })
        ? flashMessages
        : false;
    next();
};

function mkCldUrl(params, cldObj) {
    return `https://res.cloudinary.com/split-seven/image/upload/${params}/${cldObj.public_id}`;
}
