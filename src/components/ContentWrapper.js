import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';

const ContentWrapper = ({title, children}) => {
  return (
    <>
      <ScrollView
        style={{
          // height: '100%',
          backgroundColor: 'white',
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: '#EAECF0',

          paddingBottom: 0,
        }}>
        {title != '' ? (
          <Text
            style={{
              fontWeight: 600,
              fontSize: 20,
              color: '#107569',
              marginBottom: 16,
            }}>
            {title}
          </Text>
        ) : null}
        {children}
      </ScrollView>
    </>
  );
};

export default ContentWrapper;
