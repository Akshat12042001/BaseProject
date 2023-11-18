import {
    StackActions,
    DrawerActions
} from '@react-navigation/native';

let _navigator = null;

const setNavigatorRef = (ref) => {
    _navigator = ref;
}

const toggleDrawer = () => {
    _navigator.dispatch(
        DrawerActions.toggleDrawer()
    );
}

const navigate = (routeName, params) => {
    _navigator.navigate(routeName, params);
}

const push = (routeName, params) => {
    _navigator.dispatch(
        StackActions.push(routeName, params),
    );
}

const goBack = () => {
    _navigator.goBack();
}

const reset = (resetObj) => {
    _navigator.reset(resetObj);
}

const getNavigator = () => {
    return _navigator;
}

export default {
    setNavigatorRef,
    toggleDrawer,
    navigate,
    goBack,
    reset,
    push,
    getNavigator
}; 