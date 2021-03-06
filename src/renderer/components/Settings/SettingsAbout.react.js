import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import ExternalLink from '../Shared/ExternalLink.react';

import lib from '../../lib';

// sth wrong with that, need some check with Webpack
const museeksLogoRequire = require('../../../images/logos/museeks.png');
const museeksLogo = `../dist/${museeksLogoRequire}`;

class SettingsAbout extends Component {

    static propTypes = {
        version: React.PropTypes.number,
        checkForUpdate: React.PropTypes.func,
    }


    constructor(props) {
        super(props);
    }

    render() {
        const { version } = this.props;

        return (
            <div className='setting setting-about'>
                <div className='setting-section'>
                    <h4>About Museeks</h4>
                    <img src={ museeksLogo } className='logo-museeks' alt='Logo' title='Museeks logo' />
                    <p>
                        Museeks { version }{ ' - ' }
                        <ExternalLink href='http://museeks.io'>museeks.io</ExternalLink>
                        { ' - ' }
                        <ExternalLink href={ `https://github.com/KeitIG/Museeks/releases/tag/${version}` }>release notes</ExternalLink>
                        <Button bsSize='small' className='update-checker' onClick={ this.props.checkForUpdate }>Check for update</Button>
                    </p>
                </div>
                <div className='setting-section'>
                    <h4>Contributors</h4>
                    <div className='contributors-list'>
                        <p>
                            Made with <span className='heart'>♥</span> by Pierre de la Martinière
                            (<ExternalLink href='http://pierrevanmart.com'>KeitIG</ExternalLink>)
                            and a bunch of <ExternalLink href='https://github.com/KeitIG/museeks/graphs/contributors'>great people</ExternalLink>.
                        </p>
                    </div>
                </div>
                <div className='setting-section'>
                    <h4>Report issue / Ask for a feature</h4>
                    <div className='contributors-list'>
                        <p>
                            Although Museeks is mostly stable, a few bugs may still occur. Please, do
                            not hesitate to report them or to ask for features you would like to
                            see, using our&nbsp;
                            <ExternalLink href='http://github.com/KeitIG/Museeks/issues'>
                                issue tracker
                            </ExternalLink>.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

const stateToProps = (state) => ({
    version: state.system.version
});

const dispatchToProps = {
    checkForUpdate: lib.actions.settings.checkForUpdate
};

export default connect(stateToProps, dispatchToProps)(SettingsAbout);
