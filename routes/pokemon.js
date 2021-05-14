const { Router } = require('express');
const { checkCache } = require('../middleware/checkCache');
const axios = require('axios');

const router = Router();

const redis = require('redis');

const redisPort = process.env.PORT || 6379;

const redisClient = redis.createClient(redisPort);
router.get('/:name', checkCache, async(req, res) => {
    try {
        const { name } = req.params;
        const pokemonInfo = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const spritesData = pokemonInfo.data.sprites;

        redisClient.setex(name, 3600, JSON.stringify(spritesData));

        return res.json(spritesData);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

module.exports = router;