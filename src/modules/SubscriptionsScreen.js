import React from 'react';
import {View, Text, Button, Share} from 'react-native';
import ContentWrapper from '../components/ContentWrapper';

const SubscriptionsScreen = () => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Join our TestFlight beta and help us make the app better! Click the link to sign up: https://testflight.apple.com/join/YourTestFlightLink',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ContentWrapper title="Upgrade">
      <Button onPress={onShare} disabled title="Invite a Friend" />
    </ContentWrapper>
  );
};

export default SubscriptionsScreen;
