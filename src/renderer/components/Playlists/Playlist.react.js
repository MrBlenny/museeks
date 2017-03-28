import React, { Component } from 'react';
import { connect } from 'react-redux';

import TracksList    from '../Shared/TracksList.react.js';
import FullViewMessage from '../Shared/FullViewMessage.react';
import { Link } from 'react-router';

import lib from '../../lib';

/*
|--------------------------------------------------------------------------
| Playlist
|--------------------------------------------------------------------------
*/

class Playlist extends Component {

    static propTypes = {
        params: React.PropTypes.object,
        tracks: React.PropTypes.object,
        trackPlayingId: React.PropTypes.string,
        playlists: React.PropTypes.array,
        playStatus: React.PropTypes.string
    }

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.props.load(route.params.playlistId);
        this.props.setTracksCursor('playlist');
    }

    render() {
<<<<<<< HEAD:src/renderer/components/Playlists/Playlist.react.js
        if (Array.isArray(this.props.tracks) && this.props.tracks.length > 0) {
=======
        if(Array.isArray(this.props.tracks.sub) && this.props.tracks.sub.length > 0) {
>>>>>>> 3241a9d16ad0c470ad9472632bff0c3ef97551da:src/js/components/Playlists/Playlist.react.js
            return (
                <TracksList
                    type='playlist'
                    currentPlaylist={ this.props.params.playlistId }
                    tracks={ this.props.tracks.sub }
                    trackPlayingId={ this.props.trackPlayingId }
                    playlists={ this.props.playlists }
                    playStatus={ this.props.playStatus }
                />
            );
        }

        return (
            <FullViewMessage>
                <p>Empty playlist</p>
                <p className='sub-message'>You can add tracks from the <Link to='/library'>library view</Link></p>
            </FullViewMessage>
        );
    }
}

const stateToProps = (state) => ({});

const dispatchToProps = {
    load: lib.actions.playlists.load,
    setTracksCursor: lib.actions.library.setTracksCursor
};

export default connect(stateToProps, dispatchToProps)(Playlist);
