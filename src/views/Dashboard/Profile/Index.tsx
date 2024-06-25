import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft,
  faCheck,
  faScissors,
} from '@fortawesome/free-solid-svg-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';

const EditProfile = ({navigation}) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      firestore()
        .collection('Users')
        .doc(user.uid)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            const userData = documentSnapshot.data();
            setFullname(userData.fullname);
            setEmail(userData.email);
            setProfileImage(userData.image);
          }
        });
    }
  }, []);

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0].uri;
        setImageUri(source);
      }
    });
  };

  const uploadImage = async () => {
    if (imageUri) {
      const user = auth().currentUser;
      const userId = user.uid;
      const storageRef = storage().ref(`profile_images/${userId}`);

      try {
        await storageRef.putFile(imageUri);
        const downloadURL = await storageRef.getDownloadURL();

        await firestore().collection('Users').doc(userId).update({
          image: downloadURL,
        });

        setProfileImage(downloadURL);
        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile picture');
      }
    }
  };

  const handleSave = async () => {
    const user = auth().currentUser;
    const userId = user.uid;

    try {
      if (email !== user.email) {
        await user.updateEmail(email);
      }

      if (newPassword !== '' && newPassword === reNewPassword) {
        await user.updatePassword(newPassword);
      }

      await firestore().collection('Users').doc(userId).update({
        fullname: fullname,
        email: email,
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={20}
            color={'black'}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image
              source={{uri: profileImage}}
              resizeMode="cover"
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={{uri: 'https://i.imgur.com/1tMFzp8.png'}}
              resizeMode="cover"
              style={styles.profileImage}
            />
          )}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={selectImage}>
            <FontAwesomeIcon
              icon={faScissors}
              size={20}
              color={'white'}
              style={styles.editProfileButtonText}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputView}>
          <Text style={styles.label}>Fullname</Text>
          <TextInput
            style={styles.input}
            value={fullname}
            onChangeText={setFullname}
            placeholder="Fullname"
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            secureTextEntry
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.label}>Re-enter New Password</Text>
          <TextInput
            style={styles.input}
            value={reNewPassword}
            onChangeText={setReNewPassword}
            placeholder="Re-enter New Password"
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <FontAwesomeIcon icon={faCheck} size={20} color={'white'} />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, {marginTop: 20}]}
          onPress={uploadImage}>
          <FontAwesomeIcon icon={faCheck} size={20} color={'white'} />
          <Text style={styles.saveButtonText}>Save Profile Picture</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#CE304D',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#CE304D',
    paddingTop: 30,
    paddingBottom: 113,
  },
  backIcon: {
    marginBottom: 30,
    marginHorizontal: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 230,
    backgroundColor: '#BFBFBF',
    borderRadius: 50,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputView: {
    marginBottom: 20,
    marginHorizontal: 16,
  },
  label: {
    marginBottom: 8,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    backgroundColor: '#F3F3F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333647',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BFBFBF',
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 16,
  },
  saveButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
