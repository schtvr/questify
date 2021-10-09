import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import { user } from '../../screens/ProfileScreen';


const ProfileHeader = () => {

  console.log('user', user.profileUrl)

  return (
    <View style={styles.container}>
      <View style={styles.pfp}>
        <Image
          style={styles.image}
          source={{
            uri: user.profileUrl
          }}
        />
        <Text style={styles.userName}>
          { user.userName }
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  pfp: {
    alignItems: 'center'
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    paddingBottom: 10,
  },
  userName: {
    fontSize: 20,
  },
});

export default ProfileHeader;