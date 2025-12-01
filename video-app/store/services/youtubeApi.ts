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
export interface YouTubeVideoDetails {
  kind: string;
  etag: string;
  items: Array<{
    kind: string;
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: { url: string; width: number; height: number };
        medium: { url: string; width: number; height: number };
        high: { url: string; width: number; height: number };
      };
      channelTitle: string;
      tags?: string[];
      categoryId: string;
      liveBroadcastContent: string;
      localized: {
        title: string;
        description: string;
      };
    };
    contentDetails: {
      duration: string;
      dimension: string;
      definition: string;
      caption: string;
    };
    statistics: {
      viewCount: string;
      likeCount: string;
      favoriteCount: string;
      commentCount: string;
    };
  }>;
}

export const CATEGORIES = [
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

        getDetails: builder.query<any, string>({
            query: (videoId) => ({
                url: '/videos',
                params: {
                    key: API_KEY,
                    id: videoId,
                    part: 'snippet,contentDetails,statistics',
                },
            }),
        }),
    }),
});

export const {
    useSearchVideosQuery,
    useGetDetailsQuery,
    useLazySearchVideosQuery,
} = youtubeApi;