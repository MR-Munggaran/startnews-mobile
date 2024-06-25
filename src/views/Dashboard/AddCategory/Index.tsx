import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default ({navigation}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Check if the user is authenticated
    const subscriber = auth().onAuthStateChanged(user => {
      if (!user) {
        // If no user is signed in, navigate to the login screen
        navigation.navigate('Login');
      }
    });
    return subscriber; // Unsubscribe on unmount
  }, []);

  const handleAddCategory = async () => {
    if (title) {
      try {
        await firestore().collection('Category').add({
          title,
          Created_at: firestore.FieldValue.serverTimestamp(),
        });
        setTitle(''); // Clear the input field after submission
        Alert.alert('Your Insert Successfully');
        navigation.navigate('ListCategory'); // Navigate back to the category list
      } catch (error) {
        console.error('Error adding category: ', error);
      }
    } else {
      Alert.alert('Please enter a title for the category');
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity onPress={() => navigation.navigate('ListCategory')}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={20}
            color={'black'}
            style={styles.image1}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Categories</Text>
        <Text style={styles.titleText}>Title</Text>
        <TextInput
          style={styles.categoryItem}
          placeholder="Enter category title"
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity onPress={handleAddCategory}>
          <FontAwesomeIcon
            icon={faPlus}
            size={20}
            color={'black'}
            style={styles.image2}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#BC1D3A',
    paddingTop: 30,
    paddingBottom: 288,
  },
  image1: {
    width: 10,
    height: 15,
    marginBottom: 53,
    marginHorizontal: 16,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 29,
    marginBottom: 243,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 27,
    marginBottom: 13,
  },
  categoryItem: {
    height: 60,
    backgroundColor: '#BFBFBF',
    borderRadius: 25,
    marginBottom: 29,
    marginHorizontal: 24,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#000',
  },
  image2: {
    width: 43,
    height: 42,
    marginHorizontal: 30,
    alignSelf: 'flex-end',
  },
});
