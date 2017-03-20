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
        tracks: React.PropTypes.array,
        trackPlayingId: React.PropTypes.string,
        playlists: React.PropTypes.array,
        playerStatus: React.PropTypes.string
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.load(route.params.playlistId);
        this.props.setTracksCursor('playlist');
    }

    render() {
        if (Array.isArray(this.props.tracks) && this.props.tracks.length > 0) {
            return (
                <TracksList
                    type='playlist'
                    currentPlaylist={ this.props.params.playlistId }
                    tracks={ this.props.tracks }
                    trackPlayingId={ this.props.trackPlayingId }
                    playlists={ this.props.playlists }
                    playerStatus={ this.props.playerStatus }
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
