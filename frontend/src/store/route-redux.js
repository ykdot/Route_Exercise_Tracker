import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = { routes: []};

const routeStatusSlice = createSlice({
  name: 'routeStatus',
  initialState,
  reducers: {
    activate(state, action) {
      state.routes[action.index] = true;
    },
    deactivate(state, action) {
      state.routes[action.index] = false;
    }
  }
});