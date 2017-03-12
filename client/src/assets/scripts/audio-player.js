const $ = require('jquery');

class Track {
    constructor(trackData, $el, parent, trackSeq) {
        // { sequence, artist, title, url, trackImgUrl, setId }
        Object.assign(this, trackData);

        this.audio = document.createElement('audio');
        $el.append(this.audio);
        this.$img = $el.find('img').first();
        this.parent = parent;
        this.trackSeq = trackSeq;
        this.audio.addEventListener('ended', evt => {
            parent.playTrack(trackSeq + 1);
        });
        this.$el = $el;
        this.$el.click(() => { this.toggle(); });
        this.$progress = $el.find('.audioTrack-progress');
        this.$progress.click(e => { this.handleMouseSeek(e); });
        this.$progressBar = $el.find('.audioTrack-progress-bar');
        this.$duration = $el.find('.audioTrack-progress-duration');
        this.$currentTime = $el.find('.audioTrack-progress-current');
        this.img = document.createElement('img');
        this.img.setAttribute('src', this.trackImgUrl);
        this.img.classList.add('slideShow-img', 'slideShow-img_added', 'slideShow-img_fadeOut');
        this.updateTrackPos();
    }

    queueUp() {
        if (this._queued) { return; }
        this.audio.setAttribute('src', this.url);
        this._queued = true;
    }

    toggle() {
        if (this.playing) {
            this.pause();
        } else {
            this.parent.playTrack(this.trackSeq);
        }
    }

    play() {
        if (!this.queued) {
            this.queueUp();
        }
        this.audio.play();
        this.$el.addClass('playing');
        this.$el.removeClass('paused');
        this.playing = true;
        this.paused = false;
        this.ticker = setInterval(() => { this.updateTrackPos(); }, 250);
    }

    pause() {
        if (!this.queued) {
            this.queueUp();
        }
        this.audio.pause();
        this.$el.removeClass('playing');
        this.$el.addClass('paused');
        this.playing = false;
        this.paused = true;
        clearInterval(this.ticker);
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.$el.removeClass('playing paused');
        this.playing = false;
        this.paused = false;
    }

    updateTrackPos() {
        const time = this.audio.currentTime;
        const dur = this.audio.duration;
        const pct = (time / dur) * 100;
        const mins = Math.floor(time / 60);
        let secs = Math.round(time) % 60;
        if (secs < 10) {
            secs = `0${secs}`;
        }
        if (!this._durationSet) {
            if (!isNaN(dur)) {
                const dmins = Math.floor(dur / 60);
                let dsecs = Math.round(dur) % 60;
                if (dsecs < 10) { dsecs = `0${dsecs}`; }
                this.$duration.text(`${dmins}:${dsecs}`);
                this._durationSet = true;
            }
        }
        this.$currentTime.text(`${mins}:${secs}`);
        this.$progressBar.css('width', `${pct}%`);
        if (pct >= 90 || (dur - time) < 30) {
            this.parent.queueTrack(this.trackSeq + 1);
        }
    }

    handleMouseSeek(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const pos = evt.offsetX;
        const pct = pos / this.$progress.outerWidth();
        const time = pct * this.audio.duration;
        this.audio.currentTime = time;
    }
}

class SlideShow {
    constructor($el) {
        this.$el = $el;
        this.setId = $el.data('setImgTargetId');
        this.ownImg = $el.find('img');
        this.otherImgs = [];
    }

    setImg(img) {
        let found = false;
        for (const i of this.otherImgs) {
            if (i === img) {
                $(i).removeClass('slideShow-img_fadeOut');
                found = true;
            } else {
                $(i).addClass('slideShow-img_fadeOut');
            }
        }
        if (found) {
            this.ownImg.addClass('slideShow-img_fadeOut');
        }
        if (img == null) {
            this.ownImg.removeClass('slideShow-img_fadeOut');
        }
    }

    addImg(img) {
        this.otherImgs.push(img);
        this.$el.append(img);
    }
}

class TrackList {
    constructor() {
        this.slideShows = $('[data-set-img-target-id]').get()
        .map(el => {
            return new SlideShow($(el));
        });
        this.tracks = $('[data-audio-file]').get()
        .map((el, idx) => {
            return new Track(
                $(el).data('audioFile'), $(el), this, idx);
        });
        if (this.tracks.length > 0) {
            this.tracks[0].pause();
        }
        for (const t of this.tracks) {
            for (const s of this.slideShows) {
                if (t.setId === s.setId) {
                    s.addImg(t.img);
                }
            }
        }
    }

    playTrack(trackSeq) {
        if (trackSeq < 0) { return; }
        if (trackSeq >= this.tracks.length) {
            for (const show of this.slideShows) {
                show.setImg(null);
            }
            this.tracks[this.tracks.length - 1].stop();
            return;
        }
        const thisTrack = this.tracks[trackSeq];
        for (const track of this.tracks) {
            if (track === thisTrack) {
                thisTrack.play();
            } else {
                if (track.playing || track.paused) {
                    track.stop();
                }
            }
        }
        for (const show of this.slideShows) {
            if (show.setId === thisTrack.setId) {
                show.setImg(thisTrack.img);
            } else {
                show.setImg(null);
            }
        }
    }

    queueTrack(trackSeq) {
        if (trackSeq < 0 || trackSeq >= this.tracks.length) {
            return;
        }
        this.tracks[trackSeq].queueUp();
    }
}

class AudioPlayer {
    constructor() {
        this.trackList = new TrackList();
    }
};

module.exports = AudioPlayer;
