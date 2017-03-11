const keystone = require('keystone');
const Types = keystone.Field.Types;
const Set = new keystone.List('Set', {
    defaultColumns: 'sequence, title, createdAt',
    defaultSort: '-createdAt',
    map: { name: 'title' }, // shown as the Set title in admin UI
    autokey: {
        from: 'title',
        path: 'slug',
        unique: true,
        fixed: false,
    },
    track: { createdAt: true },
});

Set.add({
    sequence: { type: Types.Number, initial: true, required: true },
    title: { type: Types.Text, initial: true, required: true },
    coverImg: { label: 'Cover Image', type: Types.CloudinaryImage },
    tracks: {
        type: Types.Relationship,
        ref: 'Track',
        refPath: 'trackset',
        many: true,
    },
});

Set.relationship({ path: 'setList', ref: 'SetList', refPath: 'set' });

Set.register();
