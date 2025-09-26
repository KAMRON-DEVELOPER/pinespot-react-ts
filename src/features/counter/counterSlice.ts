import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type AppThunk, type RootState } from '@/store/store';

export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

function sleep(ms: number) {
  return new Promise<void>((resolve: () => void) => setTimeout(resolve, ms));
}
const fetchCount = async () => {
  await sleep(3000);
  return { data: 20 };
};

export const incrementAsync = createAsyncThunk('counter/fetchCount', async () => {
  const response = await fetchCount();
  return response.data;
});

export const incrementIfOdd = (amount: number): AppThunk => {
  return (dispatch, getState) => {
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount));
    }
  };
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default counterSlice.reducer;
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;
export const selectStatus = (state: RootState) => state.counter.status;
