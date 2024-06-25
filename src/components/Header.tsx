// Header.js
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerBackground} />
      <Image
        source={require('../../data/Start.png')}
        resizeMode="stretch"
        style={styles.headerText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackground: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 3,
    paddingVertical: 35,
  },
  headerText: {
    textAlign: 'center',
    height: 45,
    width: 160,
    marginVertical: 7,
  },
});

export default Header;
