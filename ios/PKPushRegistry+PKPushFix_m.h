// This is an alternative that can be used mainly for testing.
// It deals with Apple's private API, which might change at any moment, rendering this useless.
// It must not be used in apps that are submitted to the Apple store.
// 
// What does it do?
// Changes the implementation of _terminateAppIfThereAreUnhandledVoIPPushes,
// preventing a crash in iOS 13 due to receiving a VoIP push and not reporting a new incoming call through CallKit.
//
// Include this file in your swift bridging header.

#import <objc/runtime.h>
#import <PushKit/PushKit.h>

@interface PKPushRegistry (Fix)
@end

@implementation PKPushRegistry (Fix)

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class class = [self class];

        SEL originalSelector = @selector(_terminateAppIfThereAreUnhandledVoIPPushes);
        SEL swizzledSelector = @selector(doNotCrash);

        Method originalMethod = class_getInstanceMethod(class, originalSelector);
        Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);

        // When swizzling a class method, use the following:
        // Class class = object_getClass((id)self);
        // ...
        // Method originalMethod = class_getClassMethod(class, originalSelector);
        // Method swizzledMethod = class_getClassMethod(class, swizzledSelector);

        BOOL didAddMethod =
            class_addMethod(class,
                originalSelector,
                method_getImplementation(swizzledMethod),
                method_getTypeEncoding(swizzledMethod));

        if (didAddMethod) {
            class_replaceMethod(class,
                swizzledSelector,
                method_getImplementation(originalMethod),
                method_getTypeEncoding(originalMethod));
        } else {
            method_exchangeImplementations(originalMethod, swizzledMethod);
        }
        [super load];
    });
}

#pragma mark - Method Swizzling

- (void)doNotCrash {
    NSLog(@"Unhandled VoIP Push");
}

@end