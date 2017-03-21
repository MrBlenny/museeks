import Joi from 'joi';

export default [{
    method: 'GET',
    path: 'api/network/download',
    name: 'network.download',
    config : {
        validate: {
            query: {
                _id: Joi.required()
            }
        }
    },
    handler: (req, res) => {
        const query = req.query;
        return req.lib.track.findOne({ query }).then((track) => {
            return res.file(track.path, { confine : false });
        });
    }
}, {
    method: 'GET',
    path: 'api/network/find',
    name: 'network.find',
    handler: (req, res) => {
        const query = req.query;
        return req.lib.track.find({ query }).then(res);
    }
}, {
    method: 'GET',
    path: 'api/network/findOne',
    name: 'network.findOne',
    config : {
        validate: {
            query: {
                _id: Joi.required()
            }
        }
    },
    handler: (req, res) => {
        const query = req.query;
        return req.lib.track.findOne({ query }).then(res);
    }
}];
