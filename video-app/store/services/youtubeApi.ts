import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = process.env.YOUTUBE_API_KEY;
const URL = 'https://www.googleapis.com/youtube/v3';

export interface YoutubeVideo {
    kind: string;
    etag: string;
    id: {
        kind: string;
        videoId: string;
    };
    snippet: {
        pubishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            default: { url: string; width: number; height: number;};
            medium: { url: string; width: number; height: number;};
            high: { url: string; width: number; height: number;};
        };
        channelTitle: string;
        liveBroadcastContent: string;
        publishTime: string;
    };
}

export interface YoutubeSearchResponse {
    kind: string;
    etag: string;
    nextPageToken?: string;
    prevPageToken?: string;
    regionCode: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: YoutubeVideo[];
}

export interface VideoCategory {
    id: string;
    name: string;
    query: string;
}

export const CATEGORIES: VideoCategory[] = [
  { 
    id: 'react-native', 
    name: 'React Native', 
    query: 'React Native tutorial programming' 
  },
  { 
    id: 'react', 
    name: 'React', 
    query: 'React tutorial programming' 
  },
  { 
    id: 'typescript', 
    name: 'Typescript', 
    query: 'TypeScript tutorial programming' 
  },
  { 
    id: 'javascript', 
    name: 'Javascript', 
    query: 'JavaScript tutorial programming' 
  },
];

export const youtubeApi = createApi({
    reducerPath: 'youtubeApi',
    baseQuery: fetchBaseQuery({ baseUrl: URL }),
    endpoints: (builder) => ({
        searchVideos: builder.query<YoutubeSearchResponse, {
            query: string;
            maxResults?: number;
            pageToken?: string;
            order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
        }>({
            query: ({ query, maxResults=20, pageToken, order='relevance' }) => ({
                url: '/search',
                params: {
                    key: API_KEY,
                    q: query,
                    part: 'snippet',
                    type: 'video',
                    maxResults,
                    pageToken,
                    order,
                    videoDuration: 'any',
                    videoEmbeddable: true,
                    safeSearch: 'moderate',
                },
            }),
        }),

        searchVideosByCategory: builder.query<YoutubeSearchResponse, {
            categoryId: string;
            maxResults?: number;
            pageToken?: string;
        }>({
            query: ({ categoryId, maxResults=10, pageToken }) => {
                const category = CATEGORIES.find(cat => cat.id === categoryId);
                const searchQuery = category?.query || 'pragramming tutorial';

                return {
                    url: '/search',
                    params: {
                        key: API_KEY,
                        q: searchQuery,
                        part: 'snippet',
                        type: 'video',
                        maxResults,
                        pageToken,
                        order: 'relevance',
                        videoEmbeddable: true,
                        safeSearch: 'moderate',
                    },
                };
            }
        }),

        getDetails: builder.query<any, string[]>({
            query: (videoIds) => ({
                url: '/videos',
                params: {
                key: API_KEY,
                id: videoIds.join(','),
                part: 'snippet,contentDetails,statistics',
                },
            }),
        }),
    }),
});

export const {
    useSearchVideosQuery,
    useSearchVideosByCategoryQuery,
    useGetDetailsQuery,
    useLazySearchVideosQuery,
    useLazySearchVideosByCategoryQuery,
} = youtubeApi;