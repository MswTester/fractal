interface storeAction {
    type: string;
    value: any;
}
const initialAppState = {
    page:'login',
    isFetching:false,
    error:'',
    alert:'',
    user:null,
    selectedUser:null,
    homeState:'play',
    isMatching:false,
    room:null,
};
export const rootReducer = (
    state = initialAppState,
    action:storeAction
) => {
    return { ...state, [action.type]: action.value };
};
