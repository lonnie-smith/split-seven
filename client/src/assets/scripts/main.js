const $ = require('jquery');
const AudioPlayer = require('./audio-player');

class App {
    constructor() {
        this.audioPlayer = new AudioPlayer();
    }
}

window.app = new App();
