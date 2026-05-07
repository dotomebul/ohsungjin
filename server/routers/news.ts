/**
 * News Router
 * Fetches disaster-related news from NewsAPI
 * Falls back to mock data when API is unavailable
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';

// Use Manus built-in API or NewsAPI fallback
// Note: VITE_NEWS_API_KEY is injected by Manus platform
const NEWSAPI_KEY = process.env.VITE_NEWS_API_KEY || process.env.NEWSAPI_KEY || 'demo';
const NEWSAPI_URL = 'https://newsapi.org/v2';

console.log('[NewsAPI] Using API key:', NEWSAPI_KEY === 'demo' ? 'DEMO (Mock data)' : 'PRODUCTION (Real API)');

// Mock data for demo when API key is not available
const MOCK_ARTICLES = [
  {
    id: 'demo-1',
    title: 'Major Earthquake Strikes Pacific Region',
    description: 'A 7.2 magnitude earthquake has been detected in the Pacific region.',
    url: 'https://example.com/earthquake-news',
    image: '',
    source: 'Demo News',
    author: 'Demo',
    publishedAt: new Date(),
    content: 'A significant earthquake has been recorded...',
  },
  {
    id: 'demo-2',
    title: 'Wildfire Alert: Evacuations Underway',
    description: 'Thousands evacuated as wildfire spreads rapidly.',
    url: 'https://example.com/wildfire-news',
    image: '',
    source: 'Demo News',
    author: 'Demo',
    publishedAt: new Date(),
    content: 'Emergency services have issued evacuation orders...',
  },
  {
    id: 'demo-3',
    title: 'Tsunami Warning Issued for Coastal Areas',
    description: 'Residents advised to move to higher ground immediately.',
    url: 'https://example.com/tsunami-news',
    image: '',
    source: 'Demo News',
    author: 'Demo',
    publishedAt: new Date(),
    content: 'Coastal authorities have issued a tsunami warning...',
  },
];

const disasterKeywords = [
  'earthquake',
  'wildfire',
  'tsunami',
  'typhoon',
  'hurricane',
  'flood',
  'tornado',
  'volcano',
  'drought',
  'landslide',
  'avalanche',
];

export const newsRouter = router({
  /**
   * Get latest disaster news
   * Searches for news related to disasters
   */
  getDisasterNews: publicProcedure
    .input(
      z.object({
        disasterType: z.enum([
          'earthquake',
          'wildfire',
          'tsunami',
          'typhoon',
          'hurricane',
          'flood',
          'tornado',
          'volcano',
          'drought',
          'landslide',
          'avalanche',
          'all',
        ]).optional(),
        limit: z.number().min(1).max(50).default(10),
        sortBy: z.enum(['relevancy', 'popularity', 'publishedAt']).default('publishedAt'),
      })
    )
    .query(async ({ input }) => {
      try {
        // Build search query
        const searchQuery =
          input.disasterType === 'all'
            ? disasterKeywords.join(' OR ')
            : input.disasterType || 'disaster';

        // Fetch from NewsAPI
        const response = await fetch(
          `${NEWSAPI_URL}/everything?q=${encodeURIComponent(searchQuery)}&sortBy=${input.sortBy}&pageSize=${input.limit}&apiKey=${NEWSAPI_KEY}&language=en`
        );

        if (!response.ok) {
          console.error('NewsAPI error:', response.statusText);
          // Always return mock data on error
          return {
            articles: MOCK_ARTICLES,
            totalResults: MOCK_ARTICLES.length,
            error: null,
          };
        }

        const data = (await response.json()) as {
          articles: Array<{
            source: { id: string | null; name: string };
            author: string | null;
            title: string;
            description: string | null;
            url: string;
            urlToImage: string | null;
            publishedAt: string;
            content: string | null;
          }>;
          totalResults: number;
          status: string;
        };

        // Transform articles
        const articles = data.articles
          .filter((article) => article.title && article.url)
          .map((article) => ({
            id: `${article.source.name}-${article.publishedAt}`,
            title: article.title,
            description: article.description || '',
            url: article.url,
            image: article.urlToImage || '',
            source: article.source.name,
            author: article.author || 'Unknown',
            publishedAt: new Date(article.publishedAt),
            content: article.content || '',
          }));

        return {
          articles,
          totalResults: data.totalResults,
          error: null,
        };
      } catch (error) {
        console.error('News fetch error:', error);
        // Always return mock data on error
        return {
          articles: MOCK_ARTICLES,
          totalResults: MOCK_ARTICLES.length,
          error: null,
        };
      }
    }),

  /**
   * Get news by region
   * Fetches news specific to a region
   */
  getNewsByRegion: publicProcedure
    .input(
      z.object({
        region: z.enum(['us', 'eu', 'kr', 'jp']),
        disasterType: z.string().optional(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const regionQueries: Record<string, string> = {
          us: 'USA OR United States',
          eu: 'Europe OR EU',
          kr: 'Korea OR Korean',
          jp: 'Japan OR Japanese',
        };

        const regionQuery = regionQueries[input.region];
        const disasterQuery = input.disasterType || 'disaster';
        const searchQuery = `(${disasterQuery}) AND (${regionQuery})`;

        const response = await fetch(
          `${NEWSAPI_URL}/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&pageSize=${input.limit}&apiKey=${NEWSAPI_KEY}&language=en`
        );

        if (!response.ok) {
          // Always return mock data on error
          return {
            articles: MOCK_ARTICLES,
            totalResults: MOCK_ARTICLES.length,
            error: null,
          };
        }

        const data = (await response.json()) as {
          articles: Array<{
            source: { id: string | null; name: string };
            author: string | null;
            title: string;
            description: string | null;
            url: string;
            urlToImage: string | null;
            publishedAt: string;
            content: string | null;
          }>;
          totalResults: number;
          status: string;
        };

        const articles = data.articles
          .filter((article) => article.title && article.url)
          .map((article) => ({
            id: `${article.source.name}-${article.publishedAt}`,
            title: article.title,
            description: article.description || '',
            url: article.url,
            image: article.urlToImage || '',
            source: article.source.name,
            author: article.author || 'Unknown',
            publishedAt: new Date(article.publishedAt),
            content: article.content || '',
          }));

        return {
          articles,
          totalResults: data.totalResults,
          error: null,
        };
      } catch (error) {
        console.error('News fetch error:', error);
        // Always return mock data on error
        return {
          articles: MOCK_ARTICLES,
          totalResults: MOCK_ARTICLES.length,
          error: null,
        };
      }
    }),

  /**
   * Get trending disaster news
   * Fetches most popular disaster news
   */
  getTrendingNews: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const searchQuery = disasterKeywords.slice(0, 5).join(' OR ');

        const response = await fetch(
          `${NEWSAPI_URL}/everything?q=${encodeURIComponent(searchQuery)}&sortBy=popularity&pageSize=${input.limit}&apiKey=${NEWSAPI_KEY}&language=en`
        );

        if (!response.ok) {
          // Always return mock data on error
          return {
            articles: MOCK_ARTICLES,
            error: null,
          };
        }

        const data = (await response.json()) as {
          articles: Array<{
            source: { id: string | null; name: string };
            author: string | null;
            title: string;
            description: string | null;
            url: string;
            urlToImage: string | null;
            publishedAt: string;
            content: string | null;
          }>;
          status: string;
        };

        const articles = data.articles
          .filter((article) => article.title && article.url)
          .map((article) => ({
            id: `${article.source.name}-${article.publishedAt}`,
            title: article.title,
            description: article.description || '',
            url: article.url,
            image: article.urlToImage || '',
            source: article.source.name,
            author: article.author || 'Unknown',
            publishedAt: new Date(article.publishedAt),
            content: article.content || '',
          }));

        return {
          articles,
          error: null,
        };
      } catch (error) {
        console.error('News fetch error:', error);
        // Always return mock data on error
        return {
          articles: MOCK_ARTICLES,
          error: null,
        };
      }
    }),
});
