import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Draft {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl?: string;
}

const initialState: Draft = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  avatarUrl: undefined,
};

const saved = localStorage.getItem('profileDraft');
const initial = saved ? JSON.parse(saved) : initialState;

const slice = createSlice({
  name: 'profileDraft',
  initialState: initial as Draft,
  reducers: {
    updateDraft(state, action: PayloadAction<Partial<Draft>>) {
      const next = { ...state, ...action.payload };
      localStorage.setItem('profileDraft', JSON.stringify(next));
      return next;
    },
    clearDraft() {
      localStorage.removeItem('profileDraft');
      return initialState;
    },
    setDraft(state, action: PayloadAction<Draft>) {
      localStorage.setItem('profileDraft', JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const { updateDraft, clearDraft, setDraft } = slice.actions;
export default slice.reducer;
