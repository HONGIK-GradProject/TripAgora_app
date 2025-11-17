import { StyleSheet, ViewProps } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

interface SafeViewProps {
  children: React.ReactNode;
  style?: ViewProps['style'];
  edges?: Edge[];
}

const CustomSafeAreaView = ({ children, style, edges } : SafeViewProps) => {
  return (
    <SafeAreaView
      style={[styles.safeArea, style]}
      edges={edges}
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