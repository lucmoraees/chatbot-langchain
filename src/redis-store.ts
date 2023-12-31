import { ReadableStream } from "web-streams-polyfill";
(global as any).ReadableStream = ReadableStream;

import "dotenv/config";
import { createClient } from "redis";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const redis = createClient({
  url: "redis://127.0.0.1:6379",
});

export const redisVectorStore = new RedisVectorStore(
  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  {
    indexName: "documents-embeddings",
    redisClient: redis,
    keyPrefix: "documents:",
  }
);
