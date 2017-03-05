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
        this.parent = parent;
        this.trackSeq = trackSeq;
        this.$el = $el;
        this.$el.click(() => { this.toggle(); });
    }

    toggle() {
        if (this.playing) {
            this.pause();
        } else {
            this.parent.playTrack(this.trackSeq);
        }
    }

    play() {
        this.audio.play();
        this.$el.addClass('playing');
        this.$el.removeClass('paused');
        this.playing = true;
        this.paused = false;
    }

    pause() {
        this.audio.pause();
        this.$el.removeClass('playing');
        this.$el.addClass('paused');
        this.playing = false;
        this.paused = true;
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.$el.removeClass('playing paused');
        this.playing = false;
        this.paused = false;
    }
}

class TrackList {
    constructor() {
        this.tracks = $('[data-audio-file]').get()
        .map((el, idx) => {
            return new Track(
                $(el).data('audioFile'), $(el), this, idx);
        });
        this.tracks[0].pause();
    }

    playTrack(trackSeq) {
        if (trackSeq < 0 || trackSeq >= this.tracks.length) {
            return;
        }
        for (const track of this.tracks) {
            if (track === this.tracks[trackSeq]) {
                this.tracks[trackSeq].play();
            } else {
                if (track.playing || track.paused) {
                    track.stop();
                }
            }
        }
    }
}

class AudioPlayer {
    constructor() {
        this.trackList = new TrackList();
    }
};

module.exports = AudioPlayer;
