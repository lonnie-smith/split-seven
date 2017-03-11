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
    download: {
        note: 'Paste URL for .zip download here',
        type: Types.Url,
    },
    downloadText: {
        note: 'What should the download link say?',
        type: Types.Text,
        'default': 'download',
    }
});

SetList.register();
