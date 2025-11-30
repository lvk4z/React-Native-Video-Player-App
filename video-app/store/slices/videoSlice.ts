import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VideoState {
    selectedCategory: string;
}

const initialState: VideoState = {
    selectedCategory: 'react-native',
};

const videoSlice = createSlice({
    name: 'videos',
    initialState,
    reducers: {
        setSelectedCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
        }
    },
});

export const { setSelectedCategory } = videoSlice.actions;

export default videoSlice.reducer;