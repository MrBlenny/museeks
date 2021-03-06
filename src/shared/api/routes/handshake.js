import os from 'os';
import extend from 'xtend';

export default [{
    method: 'POST',
    path: 'api/handshake',
    name: 'handshake',
    handler: (req, res) => {
        const peer = extend(req.payload, { ip : req.info.remoteAddress });
        req.lib.store.dispatch(req.lib.actions.network.peerFound(peer));

        res({
            hostname: os.hostname(),
            platform: os.platform()
        });
    }
}];
