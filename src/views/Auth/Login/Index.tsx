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
import {faEnvelope, faKey} from '@fortawesome/free-solid-svg-icons';
import auth from '@react-native-firebase/auth';

const Index = ({navigation}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onLoginPress = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('Success', 'User signed in!');
        navigation.navigate('Dashboard');
      })
      .catch(error => {
        let errorMessage = 'An unknown error occurred!';
        if (error.code === 'auth/invalid-email') {
          errorMessage = 'That email address is invalid!';
        } else if (error.code === 'auth/user-not-found') {
          errorMessage = 'No user corresponding to the email!';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password!';
        }
        Alert.alert('Login Error', errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.welcomeText}>{'Welcome Editor👋'}</Text>
        <Text style={styles.infoText}>
          I am happy to see you again. You can continue where you left off by
          logging in
        </Text>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faEnvelope} size={20} color={'black'} />
          <TextInput
            style={styles.inputText}
            placeholder={'Email Address'}
            placeholderTextColor={'#7C81A1'}
            keyboardType={'email-address'}
            onChangeText={text => setEmail(text)}
            value={email}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faKey} size={20} color={'black'} />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={styles.inputText}
            placeholderTextColor={'#7C81A1'}
            onChangeText={text => setPassword(text)}
            value={password}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={onLoginPress}>
          <Text style={styles.signUpText}>{'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.signInText}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
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
    marginHorizontal: 30,
  },
  inputIconPassword: {
    width: 20,
    height: 16,
    marginHorizontal: 30,
  },
  inputText: {
    color: '#7C81A1',
    fontSize: 16,
    flex: 1,
    paddingLeft: 15,
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
