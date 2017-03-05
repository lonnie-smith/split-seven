const $ = require('jquery');

class Track {
    constructor(trackData, $el, parent, trackSeq) {
        // { sequence, artist, title }
        Object.assign(this, trackData);
        this.audio = $el.find('audio').get(0);
        this.$img = $el.find('img').first();
        this.audio.addEventListener('ended', evt => {
            parent.playTrack(trackSeq + 1);
        });
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }
}

class TrackList {
    constructor() {
        this.tracks = $('[data-audio-file]').get()
        .map((el, idx) => {
            return new Track(
                $(el).data('audioFile'), $(el), this, idx);
        });
    }

    playTrack(trackSeq) {
        if (trackSeq < 0 || trackSeq >= this.tracks.length) {
            return;
        }
        this.tracks[trackSeq].play();
    }
}

class AudioPlayer {
    constructor() {
        this.trackList = new TrackList();
    }
};

module.exports = AudioPlayer;
