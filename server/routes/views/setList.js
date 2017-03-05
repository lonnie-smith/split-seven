const keystone = require('keystone');
const _ = require('lodash');

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
            const sortList = setList;
            sortList.sets = _.sortBy(setList.sets, s => { return s.sequence; });
            for (const set of sortList.sets) {
                set.tracks = _.sortBy(set.tracks, t => { return t.sequence; });
            }
            locals.data.setList = sortList;
            locals.title = `SPLIT SEVEN // ${setList.title.toUpperCase()}`;
            next();
        })
        .catch(err => {
            next(err);
        });
    });

    view.render('set-list');
};

