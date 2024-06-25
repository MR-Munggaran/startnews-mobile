import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser, faKey, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Import firestore

const Index = ({navigation}) => {
  const [fullname, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPass, setConfirmPass] = React.useState('');

  const pressSignUp = () => {
    if (password !== confirmPass) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        const userId = user.uid;

        // Save additional user data to Firestore
        firestore()
          .collection('Users')
          .doc(userId)
          .set({
            fullname: fullname,
            email: email,
            // You can add more fields here if needed
          })
          .then(() => {
            Alert.alert('Success', 'User account created & signed in!');
            navigation.navigate('Dashboard');
          })
          .catch(error => {
            console.error('Error saving user data: ', error);
            Alert.alert(
              'Sign Up Error',
              'An error occurred while saving user data.',
            );
          });
      })
      .catch(error => {
        let errorMessage = 'An unknown error occurred!';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'That email address is already in use!';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'That email address is invalid!';
        }
        Alert.alert('Sign Up Error', errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.welcomeText}>{'Welcome to StartNews👋'}</Text>
        <Text style={styles.infoText}>
          {
            'Hello, I guess you are new around here. You can start using the application after sign up.'
          }
        </Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon
            icon={faUser}
            size={20}
            color={'black'}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Fullname"
            style={styles.inputText}
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setFullName(text)}
            value={fullname}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon
            icon={faEnvelope}
            size={20}
            color={'black'}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon
            icon={faKey}
            size={20}
            color={'black'}
            style={styles.inputIconPassword}
          />
          <TextInput
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Password"
            onChangeText={text => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            style={styles.inputText}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon
            icon={faKey}
            size={20}
            color={'black'}
            style={styles.inputIconPassword}
          />
          <TextInput
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder="Confirm Password"
            onChangeText={text => setConfirmPass(text)}
            value={confirmPass}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={pressSignUp}>
          <Text style={styles.signUpText}>{'Sign Up'}</Text>
        </TouchableOpacity>

        <View style={styles.signInText}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    paddingTop: 74,
    paddingBottom: 131,
  },
  welcomeText: {
    color: '#333647',
    fontSize: 24,
    marginBottom: 21,
    marginLeft: 12,
  },
  infoText: {
    color: '#7C81A1',
    fontSize: 16,
    marginBottom: 29,
    marginHorizontal: 12,
    width: 336,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F6',
    borderRadius: 12,
    padding: 5,
    marginBottom: 16,
    marginHorizontal: 12,
    paddingLeft: 15,
  },
  inputIcon: {
    width: 19,
    height: 20,
    marginRight: 28,
  },
  inputIconPassword: {
    width: 20,
    height: 16,
    marginRight: 27,
  },
  inputText: {
    color: '#7C81A1',
    fontSize: 16,
    flex: 1,
  },
  signUpButton: {
    alignItems: 'center',
    backgroundColor: '#CE304D',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 109,
    marginHorizontal: 12,
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  signInText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signUpLink: {
    color: '#CE304D',
    fontWeight: 'bold',
  },
});

export default Index;
