import Foundation
import HealthKit
import React

@objc(HealthKitModule)
class HealthKitModule: NSObject, RCTBridgeModule {
  static func moduleName() -> String! {
    return "HealthKitModule"
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc(requestPermissions:resolver:rejecter:)
  func requestPermissions(_ permissions: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let types = permissions["types"] as? [String] else {
      reject("Invalid Permissions", "Permissions must be provided as an array of strings", nil)
      return
    }
    
    var readTypes: Set<HKObjectType> = []
    var writeTypes: Set<HKSampleType> = []
    
    for type in types {
      if let readType = HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: type)) {
        readTypes.insert(readType)
      } else if let writeType = HKSampleType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: type)) {
        writeTypes.insert(writeType)
      }
    }
    
    let healthStore = HKHealthStore()
    healthStore.requestAuthorization(toShare: writeTypes, read: readTypes) { (success, error) in
      if success {
        resolve(true)
      } else if let error = error {
        reject("Authorization Failed", error.localizedDescription, error)
      } else {
        reject("Authorization Failed", "Unknown error occurred", nil)
      }
    }
  }
  
  @objc(checkPermissions:resolver:rejecter:)
  func checkPermissions(_ permissions: NSArray, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let healthStore = HKHealthStore()
    var permissionsStatus: [String: Bool] = [:]
    
    for type in permissions {
      if let typeString = type as? String {
        let sampleType = HKObjectType.quantityType(forIdentifier: HKQuantityTypeIdentifier(rawValue: typeString))
        let authorized = healthStore.authorizationStatus(for: sampleType!)
        permissionsStatus[typeString] = authorized == .sharingAuthorized
      }
    }
    
    resolve(permissionsStatus)
  }
}
