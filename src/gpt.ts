import { ReadableStream } from "web-streams-polyfill";
(global as any).ReadableStream = ReadableStream;

import "dotenv/config";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { RetrievalQAChain } from "langchain/chains";
import { redis, redisVectorStore } from "./redis-store";

const openAiChat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
});

const prompt = new PromptTemplate({
  template: `
    You answer questions about Generative AI.
    Use the contents of the documents to answer the user's question.
    If the answer is not found in the documents, answer that you do not know, do not try to invent an answer.

    Documents:
    {context}

    Question:
    {question}
  `.trim(),
  inputVariables: ["context", "question"],
});

const chain = RetrievalQAChain.fromLLM(
  openAiChat,
  redisVectorStore.asRetriever(3),
  {
    prompt,
    returnSourceDocuments: true,
    verbose: true,
  }
);

async function main() {
  await redis.connect();

  const response = await chain.call({
    query: "Explain what is transformers",
  });

  console.log(response.text);

  await redis.disconnect();
}

main();
