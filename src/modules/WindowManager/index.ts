import { NativeModules, Platform } from "react-native";

type Size = {
  width: number;
  height: number;
};

type NativeWindowManager = {
  setSize(width: number, height: number): void;
  setMinSize(width: number, height: number): void;
  setMaxSize(width: number, height: number): void;
  setTitle(title: string): void;
  setResizable(resizable: boolean): void;
  setFullScreen(fullScreen: boolean): void;
  setAlwaysOnTop(alwaysOnTop: boolean): void;
  center(): void;
  getSize(): Promise<Size>;
};

const isDesktop = Platform.OS === "macos" || Platform.OS === "windows";

const NativeModule: NativeWindowManager | null = isDesktop
  ? NativeModules.WindowManager
  : null;

function assertDesktop(): NativeWindowManager {
  if (!NativeModule) {
    throw new Error(
      `WindowManager is only available on desktop platforms (macos, windows). Current platform: ${Platform.OS}`,
    );
  }
  return NativeModule;
}

export const WindowManager = {
  setSize(width: number, height: number): void {
    assertDesktop().setSize(width, height);
  },

  setMinSize(width: number, height: number): void {
    assertDesktop().setMinSize(width, height);
  },

  setMaxSize(width: number, height: number): void {
    assertDesktop().setMaxSize(width, height);
  },

  setTitle(title: string): void {
    assertDesktop().setTitle(title);
  },

  setResizable(resizable: boolean): void {
    assertDesktop().setResizable(resizable);
  },

  setFullScreen(fullScreen: boolean): void {
    assertDesktop().setFullScreen(fullScreen);
  },

  setAlwaysOnTop(alwaysOnTop: boolean): void {
    assertDesktop().setAlwaysOnTop(alwaysOnTop);
  },

  center(): void {
    assertDesktop().center();
  },

  getSize(): Promise<Size> {
    return assertDesktop().getSize();
  },

  get isAvailable(): boolean {
    return NativeModule != null;
  },
} as const;
