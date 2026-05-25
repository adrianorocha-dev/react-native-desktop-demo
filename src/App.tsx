import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Button } from 'react-native-macos';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Hello World</Text>

      <View style={{ gap: 4, alignItems: 'center' }}>
        <Button
          title="I'm a native button"
          onPress={() => Alert.alert('Clicked', 'Hi!')}
        />
        <Pressable
          style={{ backgroundColor: '#2b9c76', padding: 10 }}
          onPress={() => Alert.alert('Clicked', 'Hi!')}
        >
          <Text>Me too!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    gap: 42,
  },
  text: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '700',
    color: '#2D3748',
  },
});

export default App;
