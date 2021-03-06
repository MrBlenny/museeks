import React, { Component } from 'react';
import InlineSVG from 'svg-inline-react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import lib from '../../lib';

const svgMap = {
    one: require('../../../images/icons/player-repeat-one.svg'),
    all: require('../../../images/icons/player-repeat.svg'),
    default: require('../../../images/icons/player-repeat.svg')
};

class ButtonRepeat extends Component {

    static propTypes = {
        repeat: React.PropTypes.string,
        repeatTrack: React.PropTypes.func,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const svg = svgMap[this.props.repeat] || svgMap.default;
        const buttonClasses = classnames('button repeat',{
            active: this.props.repeat === 'one' || this.props.repeat === 'all'
        });

        const svgClasses = classnames('icon', {
            'repeat-one': this.props.repeat === 'one',
            'repeat': this.props.repeat !== 'one'
        });

        return (
            <button className={ buttonClasses } onClick={ this.toggleRepeat }>
                <InlineSVG src={ svg } className={ svgClasses } />
            </button>
        );
    }

    toggleRepeat = () => {
        let repeat = 'none';

        switch (this.props.repeat) {

            case 'none':
                repeat = 'all';
                break;
            case 'all':
                repeat = 'one';
                break;
            case 'one':
                repeat = 'none';
                break;
        }

        this.props.repeatTrack(repeat);
    }
}

const stateToProps = () => ({});

const dispatchToProps = {
    repeatTrack: lib.actions.player.repeat
};

export default connect(stateToProps, dispatchToProps)(ButtonRepeat);
