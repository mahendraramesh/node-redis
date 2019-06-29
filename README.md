# Node Redis example 

Simple node application to cache data from wikipedia api in redis server.

Run redis in a docker container

```
docker run -d --name redis-server -p 6379:6379 redis
```

```
node index.js
```

Sample request

```
http://localhost:3000/api/search?query=football
```