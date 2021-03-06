import React, { Component } from 'react';
import { Link } from 'react-router';

class PlaylistsNavLink extends Component {

    static propTypes = {
        children: React.PropTypes.string,
        playlistId: React.PropTypes.string,
        onContextMenu: React.PropTypes.func
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Link
                className='playlist-link'
                activeClassName='active'
                to={ `/playlists/${this.props.playlistId}` }
                onContextMenu={ this.onContextMenu }
            >
                { this.props.children }
            </Link>
        );
    }

    onContextMenu = () => {
        this.props.onContextMenu(this.props.playlistId);
    }
}

export default PlaylistsNavLink;
