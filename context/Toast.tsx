// Toast.tsx (updated with Gesture API)
import React, { useEffect } from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

type ToastProps = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  action?: { label: string; onPress: () => void };
  onClose: () => void;
  position?: 'top' | 'bottom' | 'center';
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  action,
  onClose,
  position = 'top',
}) => {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0);
    const timeout = setTimeout(() => {
      translateY.value = withSpring(-100, {}, (finished) => {
        if (finished) runOnJS(onClose)();
      });
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX > 150) {
        runOnJS(onClose)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const iconMap = {
    success: 'check-circle',
    error: 'error',
    info: 'info',
  };

  const verticalPosition = {
    top: { top: 50 },
    bottom: { bottom: 50 },
    center: { top: Dimensions.get('window').height / 2 - 50 },
  };

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.toastContainer,
            verticalPosition[position],
            animatedStyle,
          ]}
        >
          <Icon
            name={iconMap[type]}
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.text}>{message}</Text>
          {action && (
            <Pressable onPress={action.onPress}>
              <Text style={styles.action}>{action.label}</Text>
            </Pressable>
          )}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: screenWidth * 0.8,
    zIndex: 9999,
    elevation: 10,
  },
  text: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  action: {
    color: '#00f',
    marginLeft: 10,
    fontWeight: '600',
  },
});
