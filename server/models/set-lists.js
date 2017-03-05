const keystone = require('keystone');
const Types = keystone.Field.Types;
const SetList = new keystone.List('SetList', {
    defaultColums: 'data, title',
    defaultSort: '-date',
    map: { name: 'title' },
    autokey: {
        from: 'title',
        path: 'slug',
        unique: true,
        fixed: false,
    },
});

SetList.add({
    date: { type: Types.Date, initial: true, required: true },
    title: { type: Types.Text, initial: true, required: true },
    coverImg: { label: 'Set List Image', type: Types.CloudinaryImage },
    text: { type: Types.Html, wysiwyg: true, height: 400 },
    published: {
        note: 'Check the box to make this Set List live on the site.',
        type: Types.Boolean,
        'default': false,
    },
    sets: {
        type: Types.Relationship,
        ref: 'Set',
        refPath: 'setList',
        many: true,
    },
});

// SetList.relationship({ path: 'sets', ref: 'Set', refPath: 'setList' });

SetList.register();
