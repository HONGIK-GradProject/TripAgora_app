import { StyleSheet, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SafeViewProps {
  children: React.ReactNode;
  style?: ViewProps['style'];
}

const CustomSafeAreaView = ({ children, style } : SafeViewProps) => {
  return (
    <SafeAreaView
      style={[styles.safeArea, style]}
    >
      { children }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});

export default CustomSafeAreaView;