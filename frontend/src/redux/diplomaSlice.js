import {createSlice} from '@reduxjs/toolkit';

const diplomaTypeSlice = createSlice({
    name: 'diplomaType',
    initialState: {
        diplomaTypes: {
            allDiplomaType: null,
            isFetching: false,
            error: false
        },
        msg: ''
    },
    reducers:{
        getAllDiplomaTypeStart: (state) => {
            state.diplomaTypes.isFetching = true;
            state.diplomaTypes.error = false;
        },
        getAllDiplomaTypeSuccess: (state, action) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = false;
            state.diplomaTypes.allDiplomaType = action.payload;
        },
        getAllDiplomaTypeFailed: (state) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = true;
        },
        addDiplomaTypeStart: (state) => {
            state.diplomaTypes.isFetching = true;
            state.diplomaTypes.error = false;
            state.msg = '';
        },
        addDiplomaTypeSuccess: (state) => {
            state.diplomaTypes.error = false;
            state.diplomaTypes.isFetching = false;
            state.msg = 'Thêm loại văn bằng thành công';
        },
        addDiplomaTypeFailed: (state, action) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = true;
            state.msg = action.payload;
        }
    }
})

export const {
    getAllDiplomaTypeStart,
    getAllDiplomaTypeSuccess,
    getAllDiplomaTypeFailed,
    addDiplomaTypeStart,
    addDiplomaTypeSuccess,
    addDiplomaTypeFailed
} = diplomaTypeSlice.actions;

export default diplomaTypeSlice.reducer;