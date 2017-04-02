import React, { PureComponent } from 'react';

class FullViewMessage extends PureComponent {

    static propTypes = {
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ])
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='full-message'>
                { this.props.children }
            </div>
        );
    }
}

export default FullViewMessage;
