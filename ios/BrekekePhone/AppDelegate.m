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
// #import <CallKit/CXCallObserver.h>
// #import <CallKit/CXCall.h>
#import <React/RCTLog.h>



static void InitializeFlipper(UIApplication *application) {
  NSLog(@"akkil InitializeFlipper");
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

// @interface AppDelegate ()<CXCallObserverDelegate>
// @property (strong, nonatomic) CXCallObserver *callObserver;
// @end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  NSLog(@"akkil didFinishLaunchingWithOptions");
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

//    CXCallObserver *callObserver = [[CXCallObserver alloc] init];
//    [callObserver setDelegate:self queue:nil];
//    self.callObserver = callObserver;

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self
                                            launchOptions:launchOptions];

  // https://github.com/react-native-webrtc/react-native-voip-push-notification/issues/59#issuecomment-691685841
  [RNVoipPushNotificationManager voipRegistration];
  // [RNCallKeep setup:@{
  //   @"appName": @"Qooqie Phone",
  //   @"maximumCallGroups": @3,
  //   @"maximumCallsPerCallGroup": @1,
  //   @"supportsVideo": @NO,
  //   @"imageName":@"callkit.png",
  // }];

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
  NSLog(@"akkil sourceURLForBridge");

#if DEBUG
  return
      [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"
                                                     fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main"
                                 withExtension:@"jsbundle"];
#endif
}

// Deep links
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:
                (NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
  NSLog(@"akkil openURL");

  return [RCTLinkingManager application:application
                                openURL:url
                                options:options];
}
// Universal links
- (BOOL)application:(UIApplication *)application
    continueUserActivity:(NSUserActivity *)userActivity
      restorationHandler:(void (^)(NSArray *_Nullable))restorationHandler {
  NSLog(@"akkil continueUserActivity");

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
  
  NSLog(@"akkil didUpdatePushCredentials");

  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials
                                                  forType:(NSString *)type];
}
- (void)pushRegistry:(PKPushRegistry *)registry
    didInvalidatePushTokenForType:(PKPushType)type {
  NSLog(@"akkil didInvalidatePushTokenForType");

  // TODO
}
- (void)pushRegistry:(PKPushRegistry *)registry
    didReceiveIncomingPushWithPayload:(PKPushPayload *)payload
                              forType:(PKPushType)type
                withCompletionHandler:(void (^)(void))completion {
  NSLog(@"akkil didReceiveIncomingPushWithPayload");

  NSString *uuid = [[[NSUUID UUID] UUIDString] uppercaseString];
  // NSString *uuid = payload.dictionaryPayload[@"uuid"];
    NSLog(@"akkil uuid %@", uuid);

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

 

  //     //  NSString *uuid = payload.dictionaryPayload[@"uuid"];
  // // NSString *callerName = [NSString stringWithFormat:@"%@ (Connecting...)", payload.dictionaryPayload[@"callerName"]];
  // // NSString *callerName = payload.dictionaryPayload[@"callerName"];
  // NSString *handle = payload.dictionaryPayload[@"callerNum"];

  // // NSString *handle = payload.dictionaryPayload;

  //   // NSDictionary *extra = [payload.dictionaryPayload valueForKeyPath:@"custom.path.to.data"]; /* use this to pass any special data (ie. from your notification) down to RN. Can also be `nil` */
  //  RCTLog(@"tagakhil");
  //  NSLog(@"tagakhil");
  //   NSLog(@"tagakhil %@", payload);
  //   // NSLog(@"tagakhil %s", payload);
  //   // NSLog(@"tagakhil %lu", payload);
  //   // NSLog(@"tagakhil %d", payload);

  //   // NSLog(@"tagakhil %d", payload.dictionaryPayload);
  //   // NSLog(@"tagakhil %lu", payload.dictionaryPayload);
  //   // NSLog(@"tagakhil %s", payload.dictionaryPayload);
    NSLog(@"akkil payload %@", payload.dictionaryPayload);


  // // NSLog(@"tagakhil %d", payload.dictionaryPayload[@"uuid"]);
  // //   NSLog(@"tagakhil %lu", payload.dictionaryPayload[@"uuid"]);
  // //   NSLog(@"tagakhil %s", payload.dictionaryPayload[@"uuid"]);
  //   NSLog(@"tagakhil %@", payload.dictionaryPayload[@"uuid"]);

  //   //  NSLog(@"tagakhil %d", payload.dictionaryPayload[@"x_from"]);
  //   // NSLog(@"tagakhil %lu", payload.dictionaryPayload[@"x_from"]);
  //   // NSLog(@"tagakhil %s", payload.dictionaryPayload[@"x_from"]);
  //   NSLog(@"tagakhil %@", payload.dictionaryPayload[@"x_from"]);

  //   //     NSLog(@"tagakhil %d", payload.dictionaryPayload[@"x_to"]);
  //   // NSLog(@"tagakhil %lu", payload.dictionaryPayload[@"x_to"]);
  //   // NSLog(@"tagakhil %s", payload.dictionaryPayload[@"x_to"]);
  //   NSLog(@"tagakhil %@", payload.dictionaryPayload[@"x_to"]);

  //  NSLog(@"tagakhil");


  // NSString *handle = payload.dictionaryPayload[@"callerNum"];

  NSTimeInterval delayInSeconds = 6.0;
  dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
  dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
    NSLog(@"Do some work");
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
  });

  
    }
  // --- don't need to call this if we do on the js side
  // --- already add completion in above reportNewIncomingCall
  // completion();
}

- (void)application:(UIApplication *)application
    didRegisterUserNotificationSettings:
        (UIUserNotificationSettings *)notificationSettings {
  NSLog(@"akkil didRegisterUserNotificationSettings");

  [RNCPushNotificationIOS
      didRegisterUserNotificationSettings:notificationSettings];
}
- (void)application:(UIApplication *)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"akkil didRegisterForRemoteNotificationsWithDeviceToken");

  [RNCPushNotificationIOS
      didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
- (void)application:(UIApplication *)application
    didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"akkil didFailToRegisterForRemoteNotificationsWithError");

  [RNCPushNotificationIOS
      didFailToRegisterForRemoteNotificationsWithError:error];
}
- (void)application:(UIApplication *)application
    didReceiveRemoteNotification:(NSDictionary *)userInfo
          fetchCompletionHandler:
              (void (^)(UIBackgroundFetchResult))completionHandler {
  NSLog(@"akkil didReceiveRemoteNotification");

  [RNCPushNotificationIOS
      didReceiveRemoteNotification:userInfo
            fetchCompletionHandler:^void(UIBackgroundFetchResult result){
                // Empty handler to fix `There is no completion handler with
                // notification id` error
            }];
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert |
                    UNAuthorizationOptionBadge);
}
- (void)application:(UIApplication *)application
    didReceiveLocalNotification:(UILocalNotification *)notification {
  NSLog(@"akkil didReceiveLocalNotification");

  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
    didReceiveNotificationResponse:(UNNotificationResponse *)response
             withCompletionHandler:(void (^)(void))completionHandler {
  NSLog(@"akkil didReceiveNotificationResponse");

  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  completionHandler();
}
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:
             (void (^)(UNNotificationPresentationOptions options))
                 completionHandler {
  NSDictionary *userInfo = notification.request.content.userInfo;
  [RNCPushNotificationIOS
      didReceiveRemoteNotification:userInfo
            fetchCompletionHandler:^void(UIBackgroundFetchResult result){
                // Empty handler to fix `There is no completion handler with
                // notification id` error
            }];
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert |
                    UNAuthorizationOptionBadge);
  NSLog(@"akkil willPresentNotification");

}

- (void)callObserver:(CXCallObserver *)callObserver callChanged:(CXCall *)call{
  NSLog (@"[CallObserver] event from call with UUID: %@", call.UUID);
  if (call.hasEnded) {
    NSLog (@"[CallObserver] call %@ ended", call.UUID);
    // here do whatever you like to inform the caller that the called refused the call
  }
}
@end
