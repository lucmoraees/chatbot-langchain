import { ReadableStream } from "web-streams-polyfill";
(global as any).ReadableStream = ReadableStream;

import "dotenv/config";
import path from "path";
import { createClient } from "redis";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TokenTextSplitter } from "langchain/text_splitter";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const loader = new DirectoryLoader(path.resolve(__dirname, "../tmp"), {
  ".pdf": (path) => new PDFLoader(path),
});

async function load() {
  console.log("Start loader!");

  const docs = await loader.load();

  const splitter = new TokenTextSplitter({
    encodingName: "cl100k_base",
    chunkSize: 600,
    chunkOverlap: 0,
  });

  const splittedDocuments = await splitter.splitDocuments(docs);

  const redis = createClient({
    url: "redis://127.0.0.1:6379",
  });

  await redis.connect();

  try {
    // Realize suas operações Redis aqui, após verificar a conexão com ping
    await redis.ping();

    await RedisVectorStore.fromDocuments(
      splittedDocuments,
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      {
        indexName: "documents-embeddings",
        redisClient: redis,
        keyPrefix: "documents:",
      }
    );
  } catch (error) {
    console.error("Erro ao usar o cliente Redis:", error);
  } finally {
    console.log("Fished loader!");
  }
}

load();
