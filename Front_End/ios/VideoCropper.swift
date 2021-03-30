//
//  VideoCropper.swift
//  Impact
//
//  Created by Monika B on 30/03/21.
//

import Foundation
import AVFoundation
import UIKit

enum QUALITY_ENUM: String {
  case QUALITY_LOW = "low"
  case QUALITY_MEDIUM = "medium"
  case QUALITY_HIGHEST = "highest"
  case QUALITY_640x480 = "640x480"
  case QUALITY_960x540 = "960x540"
  case QUALITY_1280x720 = "1280x720"
  case QUALITY_1920x1080 = "1920x1080"
  case QUALITY_3840x2160 = "3840x2160"
  case QUALITY_PASS_THROUGH = "passthrough"
}

@objc(VideoCropper)
class VideoCropper: NSObject {
  
  @objc func getVideoOrientationFromAsset(asset : AVAsset) -> UIImage.Orientation {
    let videoTrack: AVAssetTrack? = asset.tracks(withMediaType: .video)[0]
    let size = videoTrack!.naturalSize
    
    let txf: CGAffineTransform = videoTrack!.preferredTransform
    
    if (size.width == txf.tx && size.height == txf.ty) {
      return .left;
    } else if (txf.tx == 0 && txf.ty == 0) {
      return .right;
    } else if (txf.tx == 0 && txf.ty == size.width) {
      return .down;
    } else {
      return .up;
    }
  }
  
  @objc func crop(_ source: String, options: NSDictionary, callback: @escaping RCTResponseSenderBlock) {
    
    let cropOffsetXInt = options.object(forKey: "cropOffsetX") as! Int
    let cropOffsetYInt = options.object(forKey: "cropOffsetY") as! Int
    let cropWidthInt = options.object(forKey: "cropWidth") as? Int
    let cropHeightInt = options.object(forKey: "cropHeight") as? Int
    print("inside crop!")
    if ( cropWidthInt == nil ) {
      callback(["Invalid cropWidth", NSNull()])
      return
    }
    
    if ( cropHeightInt == nil ) {
      callback(["Invalid cropHeight", NSNull()])
      return
    }
    
    let cropOffsetX : CGFloat = CGFloat(cropOffsetXInt);
    let cropOffsetY : CGFloat = CGFloat(cropOffsetYInt);
    var cropWidth : CGFloat = CGFloat(cropWidthInt!);
    var cropHeight : CGFloat = CGFloat(cropHeightInt!);
    
    let quality = ((options.object(forKey: "quality") as? String) != nil) ? options.object(forKey: "quality") as! String : ""
    
    let sourceURL = getSourceURL(source: source)
    let asset = AVAsset(url: sourceURL as URL)
    
    let fileName = ProcessInfo.processInfo.globallyUniqueString
    let outputURL = "\(NSTemporaryDirectory())\(fileName).mp4"
    
    
    let useQuality = getQualityForAsset(quality: quality, asset: asset)
    
    print("RNVideoTrimmer passed quality: \(quality). useQuality: \(useQuality)")
    
    guard
      let exportSession = AVAssetExportSession(asset: asset, presetName: useQuality)
    else {
      callback(["Error creating AVAssetExportSession", NSNull()])
      return
    }
    
    exportSession.outputURL = NSURL.fileURL(withPath: outputURL)
    exportSession.outputFileType = .mp4
    exportSession.shouldOptimizeForNetworkUse = true
    
    let videoComposition = AVMutableVideoComposition(propertiesOf: asset)
    let clipVideoTrack: AVAssetTrack! = asset.tracks(withMediaType: .video)[0]
    let videoOrientation = self.getVideoOrientationFromAsset(asset: asset)
    
    let videoWidth : CGFloat
    let videoHeight : CGFloat
    
    if ( videoOrientation == .up || videoOrientation == .down ) {
      videoWidth = clipVideoTrack.naturalSize.height
      videoHeight = clipVideoTrack.naturalSize.width
    } else {
      videoWidth = clipVideoTrack.naturalSize.width
      videoHeight = clipVideoTrack.naturalSize.height
    }
    
    videoComposition.frameDuration = CMTimeMake(value: 1, timescale: 30)
    
    while( cropWidth.truncatingRemainder(dividingBy: 2) > 0 && cropWidth < videoWidth ) {
      cropWidth += 1.0
    }
    while( cropWidth.truncatingRemainder(dividingBy: 2) > 0 && cropWidth > 0.0 ) {
      cropWidth -= 1.0
    }
    
    while( cropHeight.truncatingRemainder(dividingBy: 2) > 0 && cropHeight < videoHeight ) {
      cropHeight += 1.0
    }
    while( cropHeight.truncatingRemainder(dividingBy: 2) > 0 && cropHeight > 0.0 ) {
      cropHeight -= 1.0
    }
    
    videoComposition.renderSize = CGSize(width: cropWidth, height: cropHeight)
    
    let instruction : AVMutableVideoCompositionInstruction = AVMutableVideoCompositionInstruction()
    instruction.timeRange = CMTimeRange(start: .zero, end: asset.duration)
    
    var t1 = CGAffineTransform.identity
    var t2 = CGAffineTransform.identity
    
    let transformer = AVMutableVideoCompositionLayerInstruction(assetTrack: clipVideoTrack)
    
    
    switch videoOrientation {
    case .up:
      t1 = CGAffineTransform(translationX: clipVideoTrack.naturalSize.height - cropOffsetX, y: 0 - cropOffsetY );
      t2 = t1.rotated(by: CGFloat.pi / 2 );
      break;
    case .left:
      t1 = CGAffineTransform(translationX: clipVideoTrack.naturalSize.width - cropOffsetX, y: clipVideoTrack.naturalSize.height - cropOffsetY );
      t2 = t1.rotated(by: CGFloat.pi  );
      break;
    case .right:
      t1 = CGAffineTransform(translationX: 0 - cropOffsetX, y: 0 - cropOffsetY );
      t2 = t1.rotated(by: 0);
      break;
    case .down:
      t1 = CGAffineTransform(translationX: 0 - cropOffsetX, y: clipVideoTrack.naturalSize.width - cropOffsetY ); // not fixed width is the real height in upside down
      t2 = t1.rotated(by: -CGFloat.pi / 2 );
      break;
    default:
      NSLog("no supported orientation has been found in this video");
      break;
    }
    
    let finalTransform: CGAffineTransform = t2
    transformer.setTransform(finalTransform, at: .zero)
    
    instruction.layerInstructions = [transformer]
    videoComposition.instructions = [instruction]
    
    exportSession.videoComposition = videoComposition
    
    exportSession.exportAsynchronously {
      switch exportSession.status {
      case .completed:
        callback( [NSNull(), outputURL] )
        
      case .failed:
        callback( ["Failed: \(exportSession.error)", NSNull()] )
        
      case .cancelled:
        callback( ["Cancelled: \(exportSession.error)", NSNull()] )
        
      default: break
      }
    }
  }
  
  func getSourceURL(source: String) -> URL {
    var sourceURL: URL
    if source.contains("assets-library") {
      sourceURL = NSURL(string: source) as! URL
    } else {
      let bundleUrl = Bundle.main.resourceURL!
      sourceURL = URL(string: source, relativeTo: bundleUrl)!
    }
    return sourceURL
  }
  
  func getQualityForAsset(quality: String, asset: AVAsset) -> String {
    var useQuality: String
    
    switch quality {
    case QUALITY_ENUM.QUALITY_LOW.rawValue:
      useQuality = AVAssetExportPresetLowQuality
      
    case QUALITY_ENUM.QUALITY_MEDIUM.rawValue:
      useQuality = AVAssetExportPresetMediumQuality
      
    case QUALITY_ENUM.QUALITY_HIGHEST.rawValue:
      useQuality = AVAssetExportPresetHighestQuality
      
    case QUALITY_ENUM.QUALITY_640x480.rawValue:
      useQuality = AVAssetExportPreset640x480
      
    case QUALITY_ENUM.QUALITY_960x540.rawValue:
      useQuality = AVAssetExportPreset960x540
      
    case QUALITY_ENUM.QUALITY_1280x720.rawValue:
      useQuality = AVAssetExportPreset1280x720
      
    case QUALITY_ENUM.QUALITY_1920x1080.rawValue:
      useQuality = AVAssetExportPreset1920x1080
      
    case QUALITY_ENUM.QUALITY_3840x2160.rawValue:
      if #available(iOS 9.0, *) {
        useQuality = AVAssetExportPreset3840x2160
      } else {
        useQuality = AVAssetExportPresetPassthrough
      }
      
    default:
      useQuality = AVAssetExportPresetPassthrough
    }
    
    let compatiblePresets = AVAssetExportSession.exportPresets(compatibleWith: asset)
    if !compatiblePresets.contains(useQuality) {
      useQuality = AVAssetExportPresetPassthrough
    }
    return useQuality
  }
  
}
