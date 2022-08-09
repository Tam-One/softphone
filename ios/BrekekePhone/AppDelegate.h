#import <React/RCTBridgeDelegate.h>
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate,
                                      UNUserNotificationCenterDelegate>

@property(nonatomic, strong) UIWindow *window;

@end
