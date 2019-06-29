const redis = require('redis');
const express = require('express');
const responseTime = require('response-time');
const axios = require('axios');

const port = 3000;
const redisPort = 6379;

const app = express();

const client = redis.createClient(redisPort, 'localhost');

app.use(responseTime());

app.get('/api/search', (request, response) => {
    const query = (request.query.query).trim();

    const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${query}`;

    client.get(`wikipedia:${query}`, async (err, cachedResult) => {
        if(cachedResult) {
            const resultJSON = JSON.parse(cachedResult);
            return response.status(200).json(resultJSON);
        }

        try {
            const fetchedResult = await axios.get(searchUrl);
            const resultJSON = fetchedResult.data;

            client.setex(`wikipedia:${query}`, 3600, JSON.stringify({ ...resultJSON }));
            response.status(200).json({ ...resultJSON });
        } catch(e) {
            return response.json(e);
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})