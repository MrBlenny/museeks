const library = (lib) => {

    const peerEndpoint = (peer) => {
        const { config } = lib.store.getState();
        const [local, remote] = process.type === 'renderer'
            ? ['renderer', 'electron']
            : ['electron', 'renderer'];

        const protocol = config[local].api.protocol;
        const host = peer.ip;
        const port = config[remote].api.port;

        return `${protocol}://${host}:${port}`;
    };

    return {
        peerEndpoint
    }
}

export default library;
