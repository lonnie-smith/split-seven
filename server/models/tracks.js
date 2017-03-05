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
        // this feature isn't working either ...
        prefix: '/tracks',
        filename: (track, file) => {
            return `${track.slug}.${file.extension}`;
        },
        // per this issue, this feature isn't working:
        // https://github.com/keystonejs/keystone/issues/916
        format: (track, file) => {
            return `<audio src="${file.href}" />`;
            // return `${track.sequence}. ${track.artist} — ${track.title}`;
        },
    },
    img: { type: Types.CloudinaryImage },
});

// define a 'url' virtual, since the prefix property on LocalFile
// doesn't work...
Track.schema.methods.getUrl = function() {
    return `/tracks/${this.audioFile.filename}`;
};

Track.relationship({ path: 'trackset', ref: 'Set', refPath: 'tracks' });

Track.register();
