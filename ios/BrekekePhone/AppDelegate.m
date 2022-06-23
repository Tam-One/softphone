#import "AppDelegate.h"
#import <Firebase.h>
#import <PushKit/PushKit.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTRootView.h>
#import <UserNotifications/UserNotifications.h>

#import "RNCallKeep.h"
#import "RNSplashScreen.h"
#import "RNVoipPushNotificationManager.h"

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>

#import <CallKit/CallKit.h>
#import <React/RCTLog.h>
#import <UserNotifications/UserNotifications.h>



static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper =
      [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc]
                            initWithRootNode:application
                        withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc]
                        initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif
  

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self
                                            launchOptions:launchOptions];

  // https://github.com/react-native-webrtc/react-native-voip-push-notification/issues/59#issuecomment-691685841
  [RNVoipPushNotificationManager voipRegistration];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"QooqiePhone"
                                            initialProperties:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f
                                                    green:1.0f
                                                     blue:1.0f
                                                    alpha:1];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

 UNUserNotificationCenter *center =
     [UNUserNotificationCenter currentNotificationCenter];
 center.delegate = self;

  [RNSplashScreen show];

  return YES;
}



- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {

#if DEBUG
  return
      [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"
                                                     fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main"
                                 withExtension:@"jsbundle"];
#endif
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}


//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

// Deep links
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:
                (NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {

  return [RCTLinkingManager application:application
                                openURL:url
                                options:options];
}
// Universal links
- (BOOL)application:(UIApplication *)application
    continueUserActivity:(NSUserActivity *)userActivity
      restorationHandler:(void (^)(NSArray *_Nullable))restorationHandler {

  [RCTLinkingManager application:application
            continueUserActivity:userActivity
              restorationHandler:restorationHandler];
  // react-native-callkeep
  return [RNCallKeep application:application
            continueUserActivity:userActivity
              restorationHandler:restorationHandler];
}

// react-native-voip-push-notification add PushKit delegate method
- (void)pushRegistry:(PKPushRegistry *)registry
    didUpdatePushCredentials:(PKPushCredentials *)credentials
                     forType:(NSString *)type {
  
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials
                                                  forType:(NSString *)type];
}
- (void)pushRegistry:(PKPushRegistry *)registry
    didInvalidatePushTokenForType:(PKPushType)type {
  // TODO
}
- (void)pushRegistry:(PKPushRegistry *)registry
    didReceiveIncomingPushWithPayload:(PKPushPayload *)payload
                              forType:(PKPushType)type
                withCompletionHandler:(void (^)(void))completion {
  NSString *uuid = [[[NSUUID UUID] UUIDString] uppercaseString];
  // --- only required if we want to call `completion()` on the js side
  // [RNVoipPushNotificationManager
  //     addCompletionHandler:uuid
  //        completionHandler:completion];
  [RNVoipPushNotificationManager
      didReceiveIncomingPushWithPayload:payload
                                forType:(NSString *)type];
   UIApplicationState state = [[UIApplication sharedApplication] applicationState];

  //   int isReject = [payload.dictionaryPayload[@"isReject"] isEqual:@"YES"] ? YES : NO;
  // if (isReject) {
  //   completion();
  //   return [RNCallKeep endCallWithUUID: uuid reason:YES];
  // }

  if (state != UIApplicationStateActive)
  {
    [RNCallKeep reportNewIncomingCall:uuid
                             handle:@"Qooqie Phone"
                         handleType:@"generic"
                           hasVideo:false
                localizedCallerName: payload.dictionaryPayload[@"x_from"]
                    supportsHolding:YES
                       supportsDTMF:YES
                   supportsGrouping:NO
                 supportsUngrouping:NO
                        fromPushKit:YES
                            payload:payload.dictionaryPayload
              withCompletionHandler:completion
              ];
   }
  // --- don't need to call this if we do on the js side
  // --- already add completion in above reportNewIncomingCall
  // completion();
}

- (void)application:(UIApplication *)application
    didRegisterUserNotificationSettings:
        (UIUserNotificationSettings *)notificationSettings {
  [RNCPushNotificationIOS
      didRegisterUserNotificationSettings:notificationSettings];
}

- (void)application:(UIApplication *)application
    didReceiveLocalNotification:(UILocalNotification *)notification {

  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

@end
