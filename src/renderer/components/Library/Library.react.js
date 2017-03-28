import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import FullViewMessage from '../Shared/FullViewMessage.react';
import TracksList from '../Shared/TracksList.react';

import lib from '../../lib';

/*
|--------------------------------------------------------------------------
| Global View
|--------------------------------------------------------------------------
*/

class Library extends Component {

    static propTypes = {
        library: React.PropTypes.object,
        tracks: React.PropTypes.object,
        trackPlayingId: React.PropTypes.string,
        playlists: React.PropTypes.array,
        playStatus: React.PropTypes.string
    }

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.props.setTracksCursor('library');
    }

    getLibraryComponent = () => {
        // Loading library
<<<<<<< HEAD:src/renderer/components/Library/Library.react.js
        if (this.props.library === null) {
=======
        if(this.props.tracks.all === null) {
>>>>>>> 3241a9d16ad0c470ad9472632bff0c3ef97551da:src/js/components/Library/Library.react.js
            return (
                <FullViewMessage>
                    <p>Loading library...</p>
                </FullViewMessage>
            );
        }

        // Empty library
        if (this.props.tracks.all.length === 0) {
            if(this.props.library.refreshing) {
                return (
                    <FullViewMessage>
                        <p>Your library is being scanned =)</p>
                        <p className='sub-message'>
                            hold still...
                        </p>
                    </FullViewMessage>
                );
            }

            return (
                <FullViewMessage>
                    <p>Too bad, there is no music in your library =(</p>
                    <p className='sub-message'>
                        <span>nothing found yet, but that's fine, you can always </span>
                        <Link to='/settings/library'>add your music here</Link>
                    </p>
                </FullViewMessage>
            );
        }
        // Empty search
        if (this.props.tracks.sub.length === 0) {
            return (
                <FullViewMessage>
                    <p>Your search returned no results</p>
                </FullViewMessage>
            );
        }

        // All good !
        return (
            <TracksList
                type='library'
<<<<<<< HEAD:src/renderer/components/Library/Library.react.js
                playStatus={ this.props.playStatus }
                tracks={ this.props.tracks }
=======
                playerStatus={ this.props.playerStatus }
                tracks={ this.props.tracks.sub }
>>>>>>> 3241a9d16ad0c470ad9472632bff0c3ef97551da:src/js/components/Library/Library.react.js
                trackPlayingId={ this.props.trackPlayingId }
                playlists={ this.props.playlists }
            />
        );
    }

    render() {
        return (
            <div className='view view-library' >
                { this.getLibraryComponent() }
            </div>
        );
    }
}

const stateToProps = (state) => ({});

const dispatchToProps = {
    setTracksCursor: lib.actions.tracks.setTracksCursor
};

export default connect(stateToProps, dispatchToProps)(Library);
