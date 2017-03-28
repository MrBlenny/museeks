import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';
import Icon from 'react-fontawesome';
import classnames from 'classnames';

import Dropzone from '../Shared/Dropzone.react';

import lib from '../../lib';

const dialog = electron.remote.dialog;


/*
|--------------------------------------------------------------------------
| Child - SettingsLibrary - manage import folders for library
|--------------------------------------------------------------------------
*/

class SettingsLibrary extends Component {

    static propTypes = {
        config: React.PropTypes.object,
        library: React.PropTypes.object,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const buttonsGroup = (
            <ButtonGroup>
                <Button bsSize='small' disabled={ this.props.library.refreshing } bsStyle={ 'danger' } onClick={ this.resetLibrary }>
                    Reset library
                </Button>
            </ButtonGroup>
        );

        return (
            <div className='setting settings-musicfolder'>
                <div className='setting-section'>
                    <h4>Manage library</h4>
                    <Dropzone
                        title='Add music to library'
                        subtitle='Drop files or folders here'
                        onDrop={ this.onDrop }
                        onClick={ this.openFolderSelector }
                    />
                    { buttonsGroup }
                </div>
            </div>
        );
    }

    resetLibrary() {
        this.props.stop();
        this.props.reset();
    }

    onDrop(e) {
        const files = [];
        const eventFiles = e.dataTransfer.files;

        for(let i = 0; i < eventFiles.length; i++) {
            files.push(eventFiles[i].path);
        }

        this.props.add(files);
    }

    openFolderSelector() {
        dialog.showOpenDialog({
            properties: ['multiSelections', 'openDirectory']
        }, (result) => {
            if(result) {
                this.props.add(result);
            }
        });
    }
}

const stateToProps = (state) => ({
    musicFolders: state.config.musicFolders,
    refreshProgress: state.library.refreshProgress,
    refreshingLibrary: state.library.refreshingLibrary,
});

const dispatchToProps = {
    stop: lib.actions.player.stop,
    reset: lib.actions.library.reset,
    add: lib.actions.library.add,
};

export default connect(stateToProps, dispatchToProps)(SettingsLibrary);
