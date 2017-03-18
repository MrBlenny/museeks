export default (config) => {
    return {
        // currentUser,
        //
        // peers,
        // source: peer,
        // destination: peer,
        // observer: peer,
        //
        // songs: [],                       // replaces tracks structure below in deleted state
        //
        // nowPlaying: {
        //
        // }

        // old state to keep from here down

        config,

        queue: [],                       // Tracks to be played
        queueCursor: null,               // The cursor of the queue

        oldQueue: null,                  // Queue backup (in case of shuffle)

        playlists: null,

        playerStatus: 'stop',            // Player status
        cover: null,                     // Current trackplaying cover
        toasts: [],                      // The array of toasts
        refreshingLibrary: false,        // If the app is currently refreshing the app
        repeat: config.audioRepeat,      // the current repeat state (one, all, none)
        shuffle: config.audioShuffle,    // If shuffle mode is enabled
        refreshProgress: 0,              // Progress of refreshing the library

        // old state to delete from here down

        tracks: {
            library: {                   // Tracks of the library view
                all: null,               // All tracks
                sub: null                // Filtered tracks (e.g search)
            },
            playlist: {
                all: null,
                sub: null
            }
        },

        tracksCursor: 'library'          // 'library' or 'playlist'
    };
}
