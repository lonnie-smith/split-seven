const $ = require('jquery');

class Track {
    constructor(trackData) {
        // { filename, filetype, originalname, path, size }
        Object.assign(this, trackData);
        console.debug(trackData)
    }
}

class TrackList {
    constructor() {
        this.tracks = $('[data-audio-file]').get()
        .map(el => {
            return new Track($(el).data('audioFile'));
        });
    }
}

class AudioPlayer {
    constructor() {
        this.trackList = new TrackList();
    }
};

module.exports = AudioPlayer;