import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/Header';

const Index = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header />
        <Text style={styles.title}>Lain - Lain</Text>
        <TouchableOpacity
          style={styles.categoryContainer}
          onPress={() => navigation.navigate('CartCategory')}>
          <Text style={styles.categoryText}>Kategori</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editorContainer}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.editorText}>Sign Up Editor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editorContainer}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.editorText}>Sign In Editor</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
  },
  title: {
    color: '#333647',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 45,
    marginLeft: 14,
    marginTop: 20,
  },
  categoryContainer: {
    backgroundColor: '#F3F3F6',
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 24,
    marginBottom: 23,
    marginHorizontal: 11,
  },
  categoryText: {
    color: '#333647',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editorContainer: {
    backgroundColor: '#F3F3F6',
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 23,
    marginBottom: 23,
    marginHorizontal: 11,
  },
  editorText: {
    color: '#333647',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Index;
