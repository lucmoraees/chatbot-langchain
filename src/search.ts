import { ReadableStream } from "web-streams-polyfill";
(global as any).ReadableStream = ReadableStream;

import "dotenv/config";
import { redis, redisVectorStore } from "./redis-store";

async function search() {
  redis.connect();

  const response = await redisVectorStore.similaritySearchWithScore(
    "Explain whats is transformers",
    5
  );

  redis.disconnect();
}

search();
