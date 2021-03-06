import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-fontawesome';
import VolumeControl from './VolumeControl.react';

import lib from '../../lib';

class PlayerControls extends PureComponent {

    static propTypes = {
        playStatus: React.PropTypes.string,
        previous: React.PropTypes.func,
        next: React.PropTypes.func,
        playToggle: React.PropTypes.func
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { next, previous, playToggle, playStatus } = this.props;
        return (
            <div className='player-controls'>
                <button type='button' className='player-control previous' onClick={ previous }>
                    <Icon name='backward' />
                </button>
                <button className='player-control play' onClick={ playToggle }>
                    <Icon name={ playStatus === 'play' ? 'pause' : 'play' } fixedWidth />
                </button>
                <button type='button' className='player-control forward' onClick={ next }>
                    <Icon name='forward' />
                </button>
                <VolumeControl />
            </div>
        );
    }
}

const stateToProps = () => ({});

const dispatchToProps = {
    previous: () => lib.actions.player.previous(),
    next: () => lib.actions.player.next(),
    playToggle: () => lib.actions.player.playToggle()
};

export default connect(stateToProps, dispatchToProps)(PlayerControls);
