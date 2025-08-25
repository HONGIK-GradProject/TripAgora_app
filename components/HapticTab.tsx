import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([_, v]) => v !== null)
  );
  return (
    <Pressable
      {...filteredProps}
      android_ripple={{ borderless: false, color: 'transparent' }}
      style={({ pressed }) => [{ opacity: pressed ? 1 : 1 }, props.style]}
    />
  );
}
