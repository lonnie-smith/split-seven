const keystone = require('keystone');

module.exports = (req, res) => {
    const view = new keystone.View(req, res);
    const locals = res.locals;

    locals.filters = { setList: req.params.setList };
    locals.title = '';
    locals.data = { setList: [] };

    // load set list
    view.on('init', next => {
        const query = keystone.list('SetList')
            .model
            .findOne({ published: true, slug: locals.filters.setList })
            .populate({
                path: 'sets',
                populate: { path: 'tracks' },
            });

        query.exec().then(setList => {
            locals.data.setList = setList;
            locals.title = `SPLIT SEVEN // ${setList.title.toUpperCase()}`;
            next();
        })
        .catch(err => {
            next(err);
        });
    });

    view.render('set-list');
};
