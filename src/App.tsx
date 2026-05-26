import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "@/components/Button";

import "./global.css";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View className="flex-1 justify-center items-center">
        <Button className="cursor-pointer">Hello world</Button>
      </View>
    </SafeAreaProvider>
  );
}

export default App;
