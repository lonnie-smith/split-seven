const keystone = require('keystone');
const Types = keystone.Field.Types;
const Track = new keystone.List('Track', {
    defaultColumns: 'sequence, artist, title, createdAt',
    defaultSort: '-createdAt',
    map: { name: 'title' }, // this is shown in the admin UI.
    autokey: {
        from: 'sequence artist title',
        path: 'slug',
        unique: true,
        fixed: false,
    },
    track: { createdAt: true },
});

Track.add({
    sequence: { type: Types.Number, initial: true, required: true },
    artist: { type: Types.Text, initial: true, required: true },
    title: { type: Types.Text, initial: true, required: true },
    audioFile: {
        type: Types.LocalFile,
        dest: 'data/tracks/',
        filename: (track, file) => {
            return `${track.slug}.${file.extension}`;
        },
        format: (track, file) => {
            return `${track.sequence}. ${track.artist} — ${track.title}`;
        },
    },
    img: { type: Types.CloudinaryImage },
});

Track.relationship({ path: 'trackset', ref: 'Set', refPath: 'tracks' });

Track.register();
