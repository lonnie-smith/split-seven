const keystone = require('keystone');

module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;

    locals.title = 'Split Seven';
    locals.data = { setLists: [] };
    // load set lists
    view.on('init', next => {
        const query = keystone.list('SetList')
            .model
            .find()
            .where('published', true)
            .sort('-date');

        query.exec().then(setLists => {
            locals.data.setLists = setLists;
            next();
        })
        .catch(err => {
            next(err);
        });
    });

    view.render('index');
};
