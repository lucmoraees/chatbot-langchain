## Redis

<br />

### Node Version

node: v18.16.0

<br />

### Run redis container

```
docker run --name langchain-redis -p 6379:6379 -d redislabs/redisearch:latest
```

<br />

### Steps to execute

1. Upload your documents on tmp directory
2. Run ts-node src/loader.ts
3. Update the question on the gpt.ts file
4. Run ts-node src/gpt.ts
