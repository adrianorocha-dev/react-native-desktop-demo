#pragma once

#include <NativeModules.h>
#include <winrt/Microsoft.UI.Windowing.h>

namespace MyApp {

REACT_MODULE(WindowManager)
struct WindowManager {
  REACT_INIT(Initialize)
  void Initialize(winrt::Microsoft::ReactNative::ReactContext const &reactContext) noexcept;

  REACT_METHOD(setSize)
  void setSize(int width, int height) noexcept;

  REACT_METHOD(setMinSize)
  void setMinSize(int width, int height) noexcept;

  REACT_METHOD(setMaxSize)
  void setMaxSize(int width, int height) noexcept;

  REACT_METHOD(setTitle)
  void setTitle(std::wstring title) noexcept;

  REACT_METHOD(setResizable)
  void setResizable(bool resizable) noexcept;

  REACT_METHOD(setFullScreen)
  void setFullScreen(bool fullScreen) noexcept;

  REACT_METHOD(setAlwaysOnTop)
  void setAlwaysOnTop(bool alwaysOnTop) noexcept;

  REACT_METHOD(center)
  void center() noexcept;

  REACT_METHOD(getSize)
  void getSize(winrt::Microsoft::ReactNative::ReactPromise<winrt::Microsoft::ReactNative::JSValueObject> promise) noexcept;

 private:
  winrt::Microsoft::UI::Windowing::AppWindow GetAppWindow() noexcept;
  winrt::Microsoft::UI::Windowing::OverlappedPresenter GetPresenter() noexcept;

  winrt::Microsoft::ReactNative::ReactContext m_reactContext;
};

} // namespace MyApp
