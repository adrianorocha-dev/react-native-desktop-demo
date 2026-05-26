#import <React/RCTBridgeModule.h>
#import <Cocoa/Cocoa.h>

@interface WindowManagerModule : NSObject <RCTBridgeModule>
@end

@implementation WindowManagerModule

RCT_EXPORT_MODULE(WindowManager)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (NSWindow *)mainWindow {
  return NSApp.mainWindow ?: [[NSApp windows] firstObject];
}

RCT_EXPORT_METHOD(setSize:(double)width height:(double)height) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [self mainWindow];
    if (!window) return;
    [window setContentSize:NSMakeSize(width, height)];
  });
}

RCT_EXPORT_METHOD(setMinSize:(double)width height:(double)height) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [self mainWindow];
    if (!window) return;
    window.minSize = NSMakeSize(width, height);
  });
}

RCT_EXPORT_METHOD(setMaxSize:(double)width height:(double)height) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [self mainWindow];
    if (!window) return;
    window.maxSize = NSMakeSize(width, height);
  });
}

RCT_EXPORT_METHOD(setTitle:(NSString *)title) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [self mainWindow];
    if (!window) return;
    window.title = title;
  });
}

RCT_EXPORT_METHOD(setResizable:(BOOL)resizable) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [self mainWindow];
    if (!window) return;
    if (resizable) {
      window.styleMask |= NSWindowStyleMaskResizable;
    } else {
      window.styleMask &= ~NSWindowStyleMaskResizable;
    }
  });
}

RCT_EXPORT_METHOD(setFullScreen:(BOOL)fullScreen) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [self mainWindow];
    if (!window) return;
    BOOL isFullScreen = (window.styleMask & NSWindowStyleMaskFullScreen) != 0;
    if (fullScreen != isFullScreen) {
      [window toggleFullScreen:nil];
    }
  });
}

RCT_EXPORT_METHOD(setAlwaysOnTop:(BOOL)alwaysOnTop) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [self mainWindow];
    if (!window) return;
    window.level = alwaysOnTop ? NSFloatingWindowLevel : NSNormalWindowLevel;
  });
}

RCT_EXPORT_METHOD(center) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [self mainWindow];
    if (!window) return;
    [window center];
  });
}

RCT_EXPORT_METHOD(getSize:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [self mainWindow];
    if (!window) {
      reject(@"NO_WINDOW", @"No main window found", nil);
      return;
    }
    NSSize size = window.contentView.frame.size;
    resolve(@{
      @"width": @(size.width),
      @"height": @(size.height),
    });
  });
}

@end
