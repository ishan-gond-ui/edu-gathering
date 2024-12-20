import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socketio",
    initialState: {
        socketId: null, // Store only the socket ID or necessary details
    },
    reducers: {
        // actions
        setSocket: (state, action) => {
            state.socketId = action.payload;
        }
    }
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
