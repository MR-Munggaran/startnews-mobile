import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faNewspaper,
  faList,
  faVideo,
  faUser,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import auth from '@react-native-firebase/auth';

const Index = ({navigation}) => {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        Alert.alert('Logged out', 'You have been logged out successfully!');
        navigation.navigate('Home');
      })
      .catch(error => {
        Alert.alert('Logout Error', error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.headerText}>Hi Editor!</Text>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ListArticles')}>
            <FontAwesomeIcon
              icon={faNewspaper}
              size={35}
              color={'white'}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>{'Artikel'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ListCategory')}>
            <FontAwesomeIcon
              icon={faList}
              size={35}
              color={'white'}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>{'Kategori'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ListVideo')}>
            <FontAwesomeIcon
              icon={faVideo}
              size={35}
              color={'white'}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>{'Video'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Profile')}>
            <FontAwesomeIcon
              icon={faUser}
              size={35}
              color={'white'}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>{'Profile'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.quitContainer} onPress={handleLogout}>
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            size={35}
            color={'white'}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>{'Quit'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#BC1D3A',
    paddingTop: 30,
    paddingBottom: 128,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 54,
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 33,
    marginHorizontal: 26,
  },
  card: {
    width: 132,
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingVertical: 24,
    paddingHorizontal: 29,
  },
  cardImage: {
    marginBottom: 21,
    alignSelf: 'center',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quitContainer: {
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 41,
    marginHorizontal: 114,
    marginTop: 20,
  },
});

export default Index;
