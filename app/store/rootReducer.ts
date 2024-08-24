interface storeAction {
    type: string;
    value: any;
}
const initialAppState = {
    lang:'en',
    state:'login',
    isFetching:false,
    errors:[],
    alerts:[],
    user:null,
    selectedUser:null,
    homeState:'lobby',
    isMatching:false,
    room:null,
};
export const rootReducer = (
    state = initialAppState,
    action:storeAction
) => {
    return { ...state, [action.type]: action.value };
};
