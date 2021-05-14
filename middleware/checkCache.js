const { getRedisClient } = require('../database/config');
const redisClient = getRedisClient();

const checkCache = (req, res, next) => {

    const { email } = req.params;

    redisClient.get(email, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }

        if (data != null) {
            res.send(data);
        } else {
            next();
        }
    });
};

const checkCacheComentario = (req, res, next) => {

    const { idComentario } = req.params;

    redisClient.get(idComentario, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }

        if (data != null) {
            res.send(data);
        } else {
            next();
        }
    });
}


module.exports = { checkCache, checkCacheComentario };