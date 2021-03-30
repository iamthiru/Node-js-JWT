//
//  CroppingBridg.m
//  Impact
//
//  Created by Monika B on 30/03/21.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VideoCropper, NSObject)

RCT_EXTERN_METHOD(crop: (NSString *) source options:(NSDictionary *)options callback:(RCTResponseSenderBlock) callback);

@end

