import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import {
  AgentExecutor,
  createOpenAIFunctionsAgent,
} from "@langchain/classic/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import Perplexity from "@perplexity-ai/perplexity_ai";

const client = new Perplexity({
  apiKey: process.env.PERPLEXITY_API_KEY, // Ensure API key is set
});

/**
 * Search using Perplexity API
 * @param query - The search query string
 * @returns Search results from Perplexity
 */
const perplexitySearch = async (query: string) => {
  try {
    console.log(`Searching Perplexity for: "${query}"`);

    const search = await client.search.create({
      query: query,
      // Optional: Uncomment to limit results
      // max_results: 5,
    });

    console.log("Search completed successfully");

    // Return the search results
    // The structure depends on Perplexity API response format
    // Common fields: answer, sources, citations
    return search;
  } catch (err: any) {
    console.error("Perplexity search error:", err.message || err);

    // Return a more informative error message
    throw new Error(
      `Perplexity search failed: ${err.message || "Unknown error"}`
    );
  }
};

/* ---------------- LLM ---------------- */
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 2000,
});

/* ---------------- Tool ---------------- */
const perplexityTool = new DynamicStructuredTool({
  name: "perplexity_search",
  description: "Search the web using Perplexity to find current information",
  schema: z.object({
    query: z.string().describe("The search query to look up"),
  }),
  func: async ({ query }) => {
    const result = await perplexitySearch(query);
    return JSON.stringify(result, null, 2);
  },
});

/* ---------------- Prompt ---------------- */
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful research assistant. Use the perplexity_search tool when you need to find current information.",
  ],
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

/* ---------------- API Handler ---------------- */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input } = body;

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const tools = [perplexityTool];

    const agent = await createOpenAIFunctionsAgent({
      llm,
      tools,
      prompt,
    });

    const executor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
      maxIterations: 5,
    });

    const response = await executor.invoke({
      input,
    });

    return NextResponse.json({
      success: true,
      output: response.output,
    });
  } catch (error: any) {
    console.error("Agent API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message ?? "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
