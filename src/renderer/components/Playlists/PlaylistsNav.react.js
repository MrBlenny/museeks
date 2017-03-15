import { api, actions } from '../../library';

import React, { Component } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import Icon from 'react-fontawesome';

import PlaylistsNavLink from './PlaylistsNavLink.react';

const ipcRenderer = electron.ipcRenderer;


/*
|--------------------------------------------------------------------------
| PlaylistsNav
|--------------------------------------------------------------------------
*/

export default class PlaylistsNav extends Component {

    static propTypes = {
        playlists: React.PropTypes.array
    }

    constructor(props) {
        super(props);

        this.state = {
            renamed: null // the playlist being renamed if there's one
        };

        this.blur            = this.blur.bind(this);
        this.keyDown         = this.keyDown.bind(this);
        this.showContextMenu = this.showContextMenu.bind(this);
    }

    render() {
        const self = this;
        // TODO (y.solovyov): extract into separate method that returns items
        const nav = this.props.playlists.map((elem, index) => {
            let navItemContent;

            if(elem._id === self.state.renamed) {
                navItemContent = (
                    <input
                        type='text'
                        ref='renamedPlaylist'
                        defaultValue={ elem.name }
                        onKeyDown={ self.keyDown }
                        onBlur={ self.blur }
                        autofocus
                    />
                );
            } else {
                navItemContent = (
                    <PlaylistsNavLink
                        playlistId={ elem._id }
                        onContextMenu={ self.showContextMenu }
                    >
                        { elem.name }
                    </PlaylistsNavLink>
                );
            }

            return (
                <div className={ 'playlist-nav-item' } key={ index }>
                    { navItemContent }
                </div>
            );
        });

        return (
            <div className='playlists-nav'>
                <div className='playlists-nav-body'>
                    { nav }
                </div>
                <div className='playlists-nav-footer'>
                    <ButtonGroup className='playlists-management'>
                        <Button bsStyle='link' bsSize='xs' onClick={ this.createPlaylist }>
                            <Icon name='plus' />
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const self = this;

        ipcRenderer.on('playlistContextMenuReply', (event, reply, _id) => {
            switch(reply) {
                case 'delete':
                    actions.playlists.remove(_id);
                    break;
                case 'rename':
                    self.setState({ renamed: _id });
                    break;
            }
        });
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('playlistContextMenuReply');
    }

    componentDidUpdate() {
        // If a playlist is being update
        if(!!this.refs.renamedPlaylist && document.activeElement !== this.refs.renamedPlaylist) {
            this.refs.renamedPlaylist.select();
        }
    }

    showContextMenu(_id) {
        ipcRenderer.send('playlistContextMenu', _id);
    }

    createPlaylist() {
        actions.playlists.create('New playlist', true);
    }

    rename(_id, name) {
        actions.playlists.rename(_id, name);
    }

    keyDown(e) {
        switch(e.keyCode) {
            case 13: { // Enter
                this.rename(this.state.renamed, e.currentTarget.value);
                this.setState({ renamed: null });
                break;
            }
            case 27: { // Escape
                this.setState({ renamed: null });
                break;
            }
        }
    }

    blur(e) {
        this.rename(this.state.renamed, e.currentTarget.value);
        this.setState({ renamed: null });
    }
}