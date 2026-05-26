#include "pch.h"
#include "WindowManagerModule.h"

#include <winrt/Microsoft.UI.Windowing.h>
#include <winrt/Microsoft.UI.interop.h>
#include <winrt/Windows.Graphics.h>

namespace MyApp {

void WindowManager::Initialize(winrt::Microsoft::ReactNative::ReactContext const &reactContext) noexcept {
  m_reactContext = reactContext;
}

winrt::Microsoft::UI::Windowing::AppWindow WindowManager::GetAppWindow() noexcept {
  HWND hwnd = GetForegroundWindow();
  if (!hwnd) return nullptr;
  auto windowId = winrt::Microsoft::UI::GetWindowIdFromWindow(hwnd);
  return winrt::Microsoft::UI::Windowing::AppWindow::GetFromWindowId(windowId);
}

winrt::Microsoft::UI::Windowing::OverlappedPresenter WindowManager::GetPresenter() noexcept {
  auto appWindow = GetAppWindow();
  if (!appWindow) return nullptr;
  return appWindow.Presenter().try_as<winrt::Microsoft::UI::Windowing::OverlappedPresenter>();
}

void WindowManager::setSize(int width, int height) noexcept {
  m_reactContext.UIDispatcher().Post([this, width, height]() {
    if (auto appWindow = GetAppWindow()) {
      appWindow.ResizeClient({width, height});
    }
  });
}

void WindowManager::setMinSize(int width, int height) noexcept {
  m_reactContext.UIDispatcher().Post([this, width, height]() {
    if (auto presenter = GetPresenter()) {
      presenter.PreferredMinimumWidth(width);
      presenter.PreferredMinimumHeight(height);
    }
  });
}

void WindowManager::setMaxSize(int width, int height) noexcept {
  m_reactContext.UIDispatcher().Post([this, width, height]() {
    if (auto presenter = GetPresenter()) {
      presenter.PreferredMaximumWidth(width);
      presenter.PreferredMaximumHeight(height);
    }
  });
}

void WindowManager::setTitle(std::wstring title) noexcept {
  m_reactContext.UIDispatcher().Post([this, title]() {
    if (auto appWindow = GetAppWindow()) {
      appWindow.Title(title);
    }
  });
}

void WindowManager::setResizable(bool resizable) noexcept {
  m_reactContext.UIDispatcher().Post([this, resizable]() {
    if (auto presenter = GetPresenter()) {
      presenter.IsResizable(resizable);
    }
  });
}

void WindowManager::setFullScreen(bool fullScreen) noexcept {
  m_reactContext.UIDispatcher().Post([this, fullScreen]() {
    auto appWindow = GetAppWindow();
    if (!appWindow) return;
    if (fullScreen) {
      appWindow.SetPresenter(winrt::Microsoft::UI::Windowing::AppWindowPresenterKind::FullScreen);
    } else {
      appWindow.SetPresenter(winrt::Microsoft::UI::Windowing::AppWindowPresenterKind::Overlapped);
    }
  });
}

void WindowManager::setAlwaysOnTop(bool alwaysOnTop) noexcept {
  m_reactContext.UIDispatcher().Post([this, alwaysOnTop]() {
    if (auto presenter = GetPresenter()) {
      presenter.IsAlwaysOnTop(alwaysOnTop);
    }
  });
}

void WindowManager::center() noexcept {
  m_reactContext.UIDispatcher().Post([this]() {
    auto appWindow = GetAppWindow();
    if (!appWindow) return;
    auto size = appWindow.ClientSize();
    auto displayArea = winrt::Microsoft::UI::Windowing::DisplayArea::GetFromWindowId(
        appWindow.Id(), winrt::Microsoft::UI::Windowing::DisplayAreaFallback::Primary);
    auto workArea = displayArea.WorkArea();
    int x = (workArea.Width - size.Width) / 2 + workArea.X;
    int y = (workArea.Height - size.Height) / 2 + workArea.Y;
    appWindow.Move({x, y});
  });
}

void WindowManager::getSize(
    winrt::Microsoft::ReactNative::ReactPromise<winrt::Microsoft::ReactNative::JSValueObject> promise) noexcept {
  m_reactContext.UIDispatcher().Post([this, promise]() {
    auto appWindow = GetAppWindow();
    if (!appWindow) {
      promise.Reject(winrt::Microsoft::ReactNative::ReactError{
          "NO_WINDOW", "No app window found"});
      return;
    }
    auto size = appWindow.ClientSize();
    auto scaleFactor = GetDpiForWindow(
        winrt::Microsoft::UI::GetWindowFromWindowId(appWindow.Id())) /
        static_cast<float>(USER_DEFAULT_SCREEN_DPI);
    winrt::Microsoft::ReactNative::JSValueObject result;
    result["width"] = size.Width / scaleFactor;
    result["height"] = size.Height / scaleFactor;
    promise.Resolve(std::move(result));
  });
}

} // namespace MyApp
