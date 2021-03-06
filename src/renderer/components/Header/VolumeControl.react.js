import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-fontawesome';
import classnames from 'classnames';

import lib from '../../lib';


// Volume easing - http://www.dr-lex.be/info-stuff/volumecontrols.html#about

const factor = 4;

const smoothifyVolume = (value) => Math.pow(value, factor);
const unsmoothifyVolume = (value) => Math.pow(value, 1 / factor); // Linearize a smoothed volume value

class VolumeControl extends Component {

    static propTypes = {
        volume: React.PropTypes.number,
        setVolume: React.PropTypes.func,
        setMuted: React.PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.state = {
            showVolume: false,
            muted: lib.player.isMuted()
        };
    }

    getVolumeIcon = (volume, muted) => {
        return muted || volume === 0 ? 'volume-off' : volume > 0.5 ? 'volume-up' : 'volume-down';
    }

    render() {
        const { volume } = this.props;

        const volumeClasses = classnames('volume-control', {
            visible: this.state.showVolume
        });

        return (
            <button type='button'
                    className='player-control volume'
                    onMouseEnter={ this.showVolume }
                    onMouseLeave={ this.hideVolume }
                    onClick={ this.mute }
            >
                <Icon name={ this.getVolumeIcon(unsmoothifyVolume(volume), this.state.muted) } />
                <div className={ volumeClasses }>
                    <input type={ 'range' }
                           min={ 0 }
                           max={ 1 }
                           step={ 0.01 }
                           value={ unsmoothifyVolume(volume) }
                           ref='volume'
                           onChange={ this.setVolume }
                    />
                </div>
            </button>
        );
    }

    setVolume = (e) => {
        const smoothVolume = smoothifyVolume(e.currentTarget.value);
        this.props.setVolume(smoothVolume);
    }

    showVolume = () => {
        this.setState({ showVolume: true });
    }

    hideVolume = () => {
        this.setState({ showVolume: false });
    }

    mute = (e) => {
        if (e.target.classList.contains('player-control') || e.target.classList.contains('fa')) {
            const muted = !lib.player.isMuted();

            this.props.setMuted(muted);
            this.setState({ muted });
        }
    }
}

const stateToProps = (state) => ({
    volume: state.player.volume,
});

const dispatchToProps = {
    setVolume: lib.actions.player.setVolume,
    setMuted: lib.actions.player.setMuted
};

export default connect(stateToProps, dispatchToProps)(VolumeControl);
