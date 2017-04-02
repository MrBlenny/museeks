import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-fontawesome';

import classnames from 'classnames';

import lib from '../../lib';

class TrackRow extends Component {

    static propTypes = {
        state: React.PropTypes.string.isRequired,
        playToggle: React.PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            hovered: false
        };
    }

    render() {
        console.log('playing bar state', this.props.state)
        const classNames = classnames('playing-indicator', this.props.state, {
            'hovered': this.state.hovered,
        });

        const icon = this.getIcon(this.props.state, this.state.hovered);

        return (
            <div className={ classNames }
                onClick={ this.props.playToggle }
                onMouseEnter={ this.onMouseEnter }
                onMouseLeave= { this.onMouseLeave }
            >
                <div className="playing-indicator">
                    { icon }
                </div>
            </div>
        );
    }

    getIcon = (state, hovered) => {
        if (state === 'play') {
            if (hovered) {
                return <Icon name='pause' fixedWidth />;
            }

            return (
                <div className="animation">
                    <div className="bar bar-first" />
                    <div className="bar bar-second" />
                    <div className="bar bar-third" />
                </div>
            );
        }

        return <Icon name='play' fixedWidth />;
    }

    onMouseEnter = () => {
        this.setState({ hovered: true });
    }

    onMouseLeave = () => {
        this.setState({ hovered: false });
    }
}

const stateToProps = () => ({});

const dispatchToProps = {
    playToggle: lib.actions.player.playToggle
};

export default connect(stateToProps, dispatchToProps)(TrackRow);
