import track from '../models/track';

const find = (data) => data.sort
    ? track.findAsync(data.query).sort(data.sort)
    : track.findAsync(data.query);

const findOne = (data) => track.findOneAsync(data.query);

const insert = (data) => track.insertAsync(data);

const update = (criteria, data) => track.updateAsync(criteria, data);

const remove = (criteria, options) => track.removeAsync(criteria, options);

export default {
    find,
    findOne,
    insert,
    update,
    remove
};
