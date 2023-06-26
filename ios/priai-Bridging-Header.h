#ifndef priai_Bridging_Header_h
#define priai_Bridging_Header_h

#import <React/RCTBridgeModule.h>


@interface RCT_EXTERN_MODULE(HealthKitModule, NSObject)


RCT_EXTERN_METHOD(requestPermissions:(NSDictionary *)permissions resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(checkPermissions:(NSArray *)permissions resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end

#endif /* priai_Bridging_Header_h */
