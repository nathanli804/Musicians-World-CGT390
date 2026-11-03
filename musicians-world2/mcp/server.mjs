// mcp/server.mjs
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { z } from 'zod';

const BASE_URL = process.env.MW_API_URL ?? 'https://musicians-world-cgt-39000.vercel.app';

const CATEGORIES = ['Guitars', 'Drums', 'Keyboards', 'Pedals & Amps', 'DJ Gear', 'Microphones'];

async function callApi(path) {
  try {
    const response = await fetch(BASE_URL + path, { headers: { Accept: 'application/json' } });
    const json = await response.json().catch(() => ({ error: 'non_json_response' }));
    return { status: response.status, ...json };
  } catch (error) {
    return { status: 502, error: 'api_unreachable', message: String(error.message ?? error) };
  }
}

function toToolResult(reply) {
  return {
    content: [{ type: 'text', text: JSON.stringify(reply, null, 2) }],
    isError: reply.status >= 400,
  };
}

function createServer() {
  const server = new McpServer(
    { name: 'musicians-world', version: '1.0.0' },
    { capabilities: { tools: {} } },
  );

  server.registerTool(
    'search_products',
    {
      title: 'Search Musicians World products',
      description:
        'Search the Musicians World gear catalog (guitars, drums, keyboards, pedals and amps, DJ gear, microphones). ' +
        'Use it when a shopper asks what gear is available, what fits a budget, or for a specific kind of instrument. Read-only. ' +
        'Returns up to 20 products with id, name, category, type, price, rating, reviewCount, leftHanded, blurb, and url (a path on the site). ' +
        'Prices are whole US dollars. category must be one of the exact listed values. ' +
        'Put a budget in maxPrice, not in query; query only matches words in the name, blurb, category, and type. ' +
        'total is the number of matches; if it is larger than count, say there are more. ' +
        'An empty data array means nothing matched; it is not an error. Stock levels and store locations are not available.',
      inputSchema: z.object({
        query: z
          .string()
          .max(60)
          .optional()
          .describe('Keyword, e.g. "acoustic", "snare", "condenser". Not a price or a category.'),
        category: z
          .enum(CATEGORIES)
          .optional()
          .describe(`Exactly one of: ${CATEGORIES.join(', ')}`),
        minPrice: z.number().min(0).optional().describe('Lowest price in US dollars'),
        maxPrice: z.number().min(0).optional().describe('Highest price in US dollars, e.g. 500 for "under $500"'),
        leftHanded: z.boolean().optional().describe('true = only left-handed instruments'),
        limit: z.number().int().min(1).max(20).optional().describe('How many products to return, 1-20. Defaults to 10.'),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ query, category, minPrice, maxPrice, leftHanded, limit }) => {
      const params = new URLSearchParams({ limit: String(limit ?? 10) });
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      if (minPrice !== undefined) params.set('minPrice', String(minPrice));
      if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice));
      if (leftHanded !== undefined) params.set('leftHanded', String(leftHanded));
      return toToolResult(await callApi(`/api/products?${params}`));
    },
  );

  return server;
}

serveStdio(createServer, { onerror: (error) => console.error(error) });
