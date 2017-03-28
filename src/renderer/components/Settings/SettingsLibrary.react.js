import React, { Component } from 'react';
<<<<<<< HEAD:src/renderer/components/Settings/SettingsLibrary.react.js
import { connect } from 'react-redux';
import { ButtonGroup, Button, ProgressBar } from 'react-bootstrap';
import Icon from 'react-fontawesome';
import classnames from 'classnames';
=======
import { ButtonGroup, Button } from 'react-bootstrap';
>>>>>>> 3241a9d16ad0c470ad9472632bff0c3ef97551da:src/js/components/Settings/SettingsLibrary.react.js

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
<<<<<<< HEAD:src/renderer/components/Settings/SettingsLibrary.react.js
        const musicFolders = this.props.musicFolders;

        const buttonsGroup = (
            <ButtonGroup>
                <Button bsSize='small' disabled={ this.props.refreshingLibrary } onClick={ this.addFolders }>
                    <Icon name='plus' fixedWidth />
                    Add folder(s)
                </Button>
                <Button bsSize='small' disabled={ this.props.refreshingLibrary } onClick={ this.refreshLibrary }>
                    <Icon name='refresh' spin={ this.props.refreshingLibrary } />
                      { this.props.refreshingLibrary ? 'Refreshing Library' : 'Refresh Library' }
                </Button>
                <Button bsSize='small' disabled={ this.props.refreshingLibrary } bsStyle={ 'danger' } onClick={ this.deleteLibrary }>
                    Delete library
=======
        const buttonsGroup = (
            <ButtonGroup>
                <Button bsSize='small' disabled={ this.props.library.refreshing } bsStyle={ 'danger' } onClick={ this.resetLibrary }>
                    Reset library
>>>>>>> 3241a9d16ad0c470ad9472632bff0c3ef97551da:src/js/components/Settings/SettingsLibrary.react.js
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

<<<<<<< HEAD:src/renderer/components/Settings/SettingsLibrary.react.js
    addFolders = () => {
        this.props.addFolders();
    }

    deleteLibrary = () => {
        this.props.stop();
        this.props.remove();
    }

    refreshLibrary = () => {
        this.props.stop();
        this.props.rescan();
=======
    resetLibrary() {
        AppActions.player.stop();
        AppActions.library.reset();
    }

    onDrop(e) {
        const files = [];
        const eventFiles = e.dataTransfer.files;

        for(let i = 0; i < eventFiles.length; i++) {
            files.push(eventFiles[i].path);
        }

        AppActions.library.add(files);
    }

    openFolderSelector() {
        dialog.showOpenDialog({
            properties: ['multiSelections', 'openDirectory']
        }, (result) => {
            if(result) {
                AppActions.library.add(result);
            }
        });
>>>>>>> 3241a9d16ad0c470ad9472632bff0c3ef97551da:src/js/components/Settings/SettingsLibrary.react.js
    }
}

const stateToProps = (state) => ({
    musicFolders: state.config.musicFolders,
    refreshProgress: state.library.refreshProgress,
    refreshingLibrary: state.library.refreshingLibrary,
});

const dispatchToProps = {
    stop: lib.actions.player.stop,
    remove: lib.actions.library.remove,
    addFolders: lib.actions.library.addFolders,
    rescan: lib.actions.library.rescan
};

export default connect(stateToProps, dispatchToProps)(SettingsLibrary);
