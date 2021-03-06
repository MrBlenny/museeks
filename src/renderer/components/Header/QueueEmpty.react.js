import React, { PureComponent } from 'react';

import classnames from 'classnames';

class QueueEmpty extends PureComponent {

    static propTypes = {
        visible: React.PropTypes.bool
    }

    constructor(props) {
        super(props);
    }

    render() {
        const queueClasses = classnames('queue text-left', {
            visible: this.props.visible
        });

        return (
            <div className={ queueClasses }>
                <div className='empty-queue text-center'>
                    queue is empty
                </div>
            </div>
        );
    }
}

export default QueueEmpty;
