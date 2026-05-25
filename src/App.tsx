import {
  Alert,
  Pressable,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Button } from "react-native-macos";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import "../global.css";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View className="p-safe flex-1 justify-center items-center bg-gray-200 gap-10">
      <Text className="text-3xl text-center font-bold text-gray-800">
        Hello World
      </Text>

      <View className="gap-1 items-center">
        <Button
          title="I'm a native button"
          onPress={() => Alert.alert("Clicked", "Hi!")}
        />
        <Pressable
          className="bg-emerald-600 p-2.5 active:bg-emerald-800 rounded-full"
          onPress={() => Alert.alert("Clicked", "Hi!")}
        >
          <Text className="text-white">Me too!</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default App;
