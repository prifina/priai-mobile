import React, {useState, useEffect, useContext} from 'react';
import {View, Text, Button} from 'react-native';
import axios from 'axios';
import Share from 'react-native-share';

import {
  UPDATE_AND_PUBLISH_SHARE_COUNT,
  CREATE_AND_PUBLISH_NEW_SHARE,
  GET_SHARE_COUNT,
} from '../utils/queries';

import AppContext from '../hoc/AppContext';

import config from '../../config';

const SubscriptionsScreen = () => {
  const {userId, shareCount, setShareCount, shareMessage} =
    useContext(AppContext);

  console.log('userId', userId);

  console.log('share count', shareCount);
  console.log('share message', shareMessage);

  const onShare = async () => {
    const shareOptions = {
      message: shareMessage,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);

      if (ShareResponse.action === Share.sharedAction) {
        const newShareCount = shareCount + 100;

        // get current share count
        const currentShare = await axios.post(config.GRAPHCMS_API_KEY, {
          query: GET_SHARE_COUNT,
          variables: {userId: userId},
        });

        if (currentShare.data.data.share) {
          // if a share with that userId exists, update it
          try {
            await axios.post(config.GRAPHCMS_API_KEY, {
              query: UPDATE_AND_PUBLISH_SHARE_COUNT,
              variables: {userId: userId, shareCount: newShareCount},
            });

            setShareCount(newShareCount);
          } catch (error) {
            console.log('Error => 1', error);
          }
        } else {
          // if a share with that userId doesn't exist, create a new one
          try {
            await axios.post(config.GRAPHCMS_API_KEY, {
              query: CREATE_AND_PUBLISH_NEW_SHARE,
              variables: {userId: userId, shareCount: newShareCount},
            });

            setShareCount(newShareCount);
          } catch (error) {
            console.log('Error => 2', error.response);
          }
        }
      }
    } catch (error) {
      console.log('Error => 3', error);
    }
  };

  return (
    <>
      <Button
        title="Share"
        onPress={onShare}
        disabled={shareMessage == '' ? true : false}
      />
      <Text>{shareCount}</Text>
    </>
  );
};

export default SubscriptionsScreen;
