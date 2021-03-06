import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from '../Avatar';
import Popover from 'react-popover-wrapper';
import './styles.css';

import lib from '../../lib';

class OutputDevice extends Component {

    static propTypes = {
        setOutput: React.PropTypes.func.isRequired,
        peers: React.PropTypes.array.isRequired,
        me: React.PropTypes.object.isRequired,
        output: React.PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { peers, me, output, setOutput } = this.props;
        const allOutputs = [
            ...peers,
            me
        ];

        const textStyle = {
            marginLeft: '10px'
        };

        return (
            <div className="output-controls">
                <Popover preferPlace="above">
                    <div className="outputDeviceTrigger">Output:<Avatar style={ { marginLeft: '7px' } } name={ output.hostname } /></div>
                    <div className="PopoverMenu">
                        { allOutputs.map((option) => {
                            const setOutputFn = () => setOutput(option);
                            return (
                                <a key={ option.hostname } onClick={ setOutputFn } >
                                    <Avatar name={ option.hostname } />
                                    <span style={ textStyle }>{ option.hostname }</span>
                                </a>
                            );
                        })}
                    </div>
                </Popover>
            </div>
        );
    }
}

const stateToProps = () => ({});

const dispatchToProps = {
    setOutput: lib.actions.network.setOutput
};

export default connect(stateToProps, dispatchToProps)(OutputDevice);
