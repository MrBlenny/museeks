import Promise from 'bluebird';
import utils from '../../shared/utils/utils';

class Player {

    constructor() {
        this.audio = new Audio();
        this.threshold = 0.75;
        this.durationThresholdReached = false;
    }

    init(lib) {
        this.lib = lib;

        const dispatch = this.lib.store.dispatch;

        // binding for media keys
        // this.audio.addEventListener('play',  () => dispatch(this.lib.actions.player.play()));
        // this.audio.addEventListener('pause', () => dispatch(this.lib.actions.player.pause()));

        this.audio.addEventListener('ended', () => dispatch(this.lib.actions.player.next()));
        this.audio.addEventListener('error', (e) => dispatch(this.lib.actions.player.audioError(e)));
        this.audio.addEventListener('timeupdate', this.tick);
    }

    tick = () => {
        if (this.isThresholdReached()) {
            this.lib.store.dispatch(this.lib.actions.tracks.incrementPlayCount({ track : this.getMetadata() }));
        }
    }

    setPlaybackRate = (playbackRate) => {
        this.audio.playbackRate = playbackRate;
        this.audio.defaultPlaybackRate = playbackRate;
    }

    play = () => {
        this.lib.tray.setContextMenu('play');
        this.audio.play();
    }

    pause = () => {
        this.lib.tray.setContextMenu('pause');
        this.audio.pause();
    }

    stop = () => {
        this.lib.tray.setContextMenu('pause');
        this.audio.pause();
    }

    setMetadata = (metadata) => {
        this.metadata = metadata;

        this.lib.tray.updateTrayMetadata(metadata);
        this.lib.tray.setContextMenu('play');

        this.audio.src = utils.trackEndpoint({
            _id: metadata._id,
            peer: metadata.owner
        });

        // when we change song, we need to update the thresholdReached indicator
        this.durationThresholdReached = false;

        return Promise.resolve(metadata);
    }

    isThresholdReached() {
        if (!this.durationThresholdReached && this.audio.currentTime >= this.audio.duration * this.threshold) {
            this.durationThresholdReached = true;
            return this.durationThresholdReached;
        }
    }

    getAudio = () => Promise.resolve(this.audio)

    setCurrentTime = (currentTime) => Promise.resolve(this.audio.currentTime = currentTime);

    isMuted = () => this.audio.muted

    isPaused = () => this.audio.paused

    setMuted = (status) => this.audio.muted = status

    mute = () => this.audio.muted = true

    unmute = () => this.audio.muted = false

    getCurrentTime = () => this.audio.currentTime

    getVolume = () => this.audio.volume

    getSrc = () => this.audio.src

    getMetadata = () => this.metadata

    setVolume = (volume) => this.audio.volume = volume
}

export default Player;
