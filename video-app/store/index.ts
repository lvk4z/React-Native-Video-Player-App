import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import videosReducer from './slices/videoSlice'
import { youtubeApi } from './services/youtubeApi';

export const store = configureStore({
  reducer: {
    [youtubeApi.reducerPath]: youtubeApi.reducer,
    videos: videosReducer,
  },

  middleware: (getDefault) => getDefault().concat(youtubeApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;