import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';
import Icon from 'react-fontawesome';

import lib from '../../lib';

import PlaylistsNavLink from './PlaylistsNavLink.react';
import { remote } from 'electron';
const { Menu } = remote;

/*
|--------------------------------------------------------------------------
| PlaylistsNav
|--------------------------------------------------------------------------
*/

class PlaylistsNav extends Component {

    static propTypes = {
        playlists: React.PropTypes.array
    }

    constructor(props) {
        super(props);

        this.state = {
            renamed: null // the playlist being renamed if there's one
        };
<<<<<<< HEAD:src/renderer/components/Playlists/PlaylistsNav.react.js
=======

        this.blur            = this.blur.bind(this);
        this.focus           = this.focus.bind(this);
        this.keyDown         = this.keyDown.bind(this);
        this.showContextMenu = this.showContextMenu.bind(this);
>>>>>>> 3241a9d16ad0c470ad9472632bff0c3ef97551da:src/js/components/Playlists/PlaylistsNav.react.js
    }

    render() {
        const self = this;
        // TODO (y.solovyov): extract into separate method that returns items
        const nav = this.props.playlists.map((elem, index) => {
            let navItemContent;

            if (elem._id === self.state.renamed) {
                navItemContent = (
                    <input
                        type='text'
                        autoFocus
                        defaultValue={ elem.name }
                        onKeyDown={ self.keyDown }
                        onBlur={ self.blur }
                        onFocus={ self.focus }
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

<<<<<<< HEAD:src/renderer/components/Playlists/PlaylistsNav.react.js
    componentDidUpdate = () => {
        // If a playlist is being update
        if (!!this.refs.renamedPlaylist && document.activeElement !== this.refs.renamedPlaylist) {
            this.refs.renamedPlaylist.select();
        }
=======
    componentDidMount() {
        const self = this;

        ipcRenderer.on('playlistContextMenuReply', (event, reply, _id) => {
            switch(reply) {
                case 'delete':
                    AppActions.playlists.remove(_id);
                    break;
                case 'rename':
                    self.setState({ renamed: _id });
                    break;
            }
        });
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('playlistContextMenuReply');
>>>>>>> 3241a9d16ad0c470ad9472632bff0c3ef97551da:src/js/components/Playlists/PlaylistsNav.react.js
    }

    showContextMenu(_id) {
        const renamePlaylist = () => {
            this.setState({ renamed: _id });
        };
        const deletePlaylist = () => {
            this.props.remove(_id);
        };
        const template = [
            {
                label: 'Delete',
                click: deletePlaylist
            },
            {
                label: 'Rename',
                click: renamePlaylist
            }
        ];
        const menu = Menu.buildFromTemplate(template);
        menu.popup(remote.getCurrentWindow());
    }

    createPlaylist = () => {
        this.props.create('New playlist', true);
    }

    rename(_id, name) {
        this.props.rename(_id, name);
    }

    keyDown = (e) => {
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

    blur = (e) => {
        this.rename(this.state.renamed, e.currentTarget.value);
        this.setState({ renamed: null });
    }

    focus(e) {
        e.currentTarget.select();
    }
}

const stateToProps = () => ({});

const dispatchToProps = {
    remove: lib.actions.playlists.remove,
    create: lib.actions.playlists.create,
    rename: lib.actions.playlists.rename
};

export default connect(stateToProps, dispatchToProps)(PlaylistsNav);
