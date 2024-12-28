import { LayoutAnimation } from 'react-native';
import { Easing, ExitAnimationsValues, withTiming } from 'react-native-reanimated';

const DISTANCE = 10;
const ANIMATION_EASING = Easing.inOut(Easing.ease);

export const exitUp = (values: ExitAnimationsValues) => {
    'worklet';
    const animations = {
        opacity: withTiming(0, { duration: 300, easing: ANIMATION_EASING }),
        transform: [{ translateY: withTiming(DISTANCE * -1, { duration: 300, easing: ANIMATION_EASING }) }],
    };
    const initialValues = {
        originX: values.currentOriginX,
        opacity: 1,
        transform: [{ translateY: 0 }],
    };
    return {
        initialValues,
        animations,
    };
};

export const exitDown = (values: ExitAnimationsValues) => {
    'worklet';
    const animations = {
        opacity: withTiming(0, { duration: 300, easing: ANIMATION_EASING }),
        transform: [{ translateY: withTiming(DISTANCE, { duration: 300, easing: ANIMATION_EASING }) }],
    };
    const initialValues = {
        originX: values.currentOriginX,
        opacity: 1,
        transform: [{ translateY: 0 }],
    };
    return {
        initialValues,
        animations,
    };
};

export const enterUp = (values: ExitAnimationsValues) => {
    'worklet';
    const animations = {
        opacity: withTiming(1, { duration: 300, easing: ANIMATION_EASING }),
        transform: [{ translateY: withTiming(0, { duration: 300, easing: ANIMATION_EASING }) }],
    };
    const initialValues = {
        originX: values.currentOriginX,
        opacity: 0,
        transform: [{ translateY: DISTANCE }],
    };
    return {
        initialValues,
        animations,
    };
};

export const enterDown = (values: ExitAnimationsValues) => {
    'worklet';
    const animations = {
        opacity: withTiming(1, { duration: 300, easing: ANIMATION_EASING }),
        transform: [{ translateY: withTiming(0, { duration: 300, easing: ANIMATION_EASING }) }],
    };
    const initialValues = {
        originX: values.currentOriginX,
        opacity: 0,
        transform: [{ translateY: DISTANCE * -1 }],
    };
    return {
        initialValues,
        animations,
    };
};