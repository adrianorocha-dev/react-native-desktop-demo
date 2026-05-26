import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WindowManagerDemo } from "../modules/WindowManager/demo/WindowManagerDemo";

import "./global.css";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View className="flex-1">
        <WindowManagerDemo />
      </View>
    </SafeAreaProvider>
  );
}

export default App;
