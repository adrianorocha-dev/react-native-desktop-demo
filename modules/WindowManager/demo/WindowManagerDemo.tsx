import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { WindowManager } from "@modules/WindowManager";

export function WindowManagerDemo() {
  return (
    <ScrollView
      className="bg-gray-200"
      contentContainerClassName="justify-center items-center gap-6 py-10"
    >
      <Text className="text-3xl text-center font-bold text-gray-800">
        WindowManager Demo
      </Text>

      <Section title="Resize">
        <DemoButton
          label="800 x 600"
          onPress={() => WindowManager.setSize(800, 600)}
        />
        <DemoButton
          label="1200 x 900"
          onPress={() => WindowManager.setSize(1200, 900)}
        />
        <DemoButton
          label="Get Size"
          onPress={async () => {
            const size = await WindowManager.getSize();
            Alert.alert("Window Size", `${size.width} x ${size.height}`);
          }}
        />
      </Section>

      <Section title="Constraints">
        <DemoButton
          label="Min 600x400"
          onPress={() => WindowManager.setMinSize(600, 400)}
        />
        <DemoButton
          label="Max 1200x900"
          onPress={() => WindowManager.setMaxSize(1200, 900)}
        />
        <DemoButton
          label="Clear Max"
          onPress={() => WindowManager.setMaxSize(99999, 99999)}
        />
      </Section>

      <Section title="Window">
        <DemoButton label="Center" onPress={() => WindowManager.center()} />
        <DemoButton
          label='Title: "Testing!"'
          onPress={() => WindowManager.setTitle("Testing!")}
        />
        <DemoButton
          label="Title: MyApp"
          onPress={() => WindowManager.setTitle("MyApp")}
        />
      </Section>

      <Section title="Toggles">
        <DemoButton
          label="Fullscreen ON"
          onPress={() => WindowManager.setFullScreen(true)}
        />
        <DemoButton
          label="Fullscreen OFF"
          onPress={() => WindowManager.setFullScreen(false)}
        />
        <DemoButton
          label="Always On Top ON"
          onPress={() => WindowManager.setAlwaysOnTop(true)}
        />
        <DemoButton
          label="Always On Top OFF"
          onPress={() => WindowManager.setAlwaysOnTop(false)}
        />
        <DemoButton
          label="Resizable OFF"
          onPress={() => WindowManager.setResizable(false)}
        />
        <DemoButton
          label="Resizable ON"
          onPress={() => WindowManager.setResizable(true)}
        />
      </Section>
    </ScrollView>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <View className="w-full max-w-md gap-2 px-4">
      <Text className="text-lg font-semibold text-gray-600">{title}</Text>
      <View className="flex-row flex-wrap gap-2">{children}</View>
    </View>
  );
}

type DemoButtonProps = {
  label: string;
  onPress: () => void;
};

function DemoButton({ label, onPress }: DemoButtonProps) {
  return (
    <Pressable
      className="bg-emerald-600 px-3 py-2 active:bg-emerald-950 hover:bg-emerald-800 rounded-lg"
      onPress={onPress}
    >
      <Text className="text-white text-sm">{label}</Text>
    </Pressable>
  );
}
