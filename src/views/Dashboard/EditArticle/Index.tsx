import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {launchImageLibrary} from 'react-native-image-picker';

const EditArticleScreen = ({navigation, route}) => {
  const {articleId} = route.params;
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [imageUri, setImageUri] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [initialImageUri, setInitialImageUri] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const categorySnapshot = await firestore().collection('Category').get();
      const categoriesData = categorySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    };

    const loadArticleData = async () => {
      const articleDoc = await firestore()
        .collection('Article')
        .doc(articleId)
        .get();
      if (articleDoc.exists) {
        const articleData = articleDoc.data();
        setTitle(articleData.title);
        setCategory(articleData.id_category);
        setContent(articleData.content);
        setImageUri(articleData.image);
        setInitialImageUri(articleData.image);
      }
    };

    fetchCategories();
    loadArticleData();

    const subscriber = auth().onAuthStateChanged(user => {
      if (!user) {
        navigation.navigate('Login');
      } else {
        setUser(user);
      }
    });

    return subscriber; // Unsubscribe on unmount
  }, [navigation, articleId]);

  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    if (!title || !category || !content) {
      Alert.alert('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = initialImageUri;

      if (imageUri && imageUri !== initialImageUri) {
        const imagePath = `images/${Date.now()}_${title}.jpg`;
        const reference = storage().ref(imagePath);
        await reference.putFile(imageUri);
        imageUrl = await reference.getDownloadURL();
      }

      await firestore().collection('Article').doc(articleId).update({
        title,
        content,
        updated_at: firestore.FieldValue.serverTimestamp(),
        id_category: category,
        image: imageUrl,
      });

      setLoading(false);
      navigation.navigate('ListArticles');
    } catch (error) {
      setLoading(false);
      console.error('Error updating article: ', error);
      Alert.alert('Error updating article');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>
        <TouchableOpacity onPress={() => navigation.navigate('ListArticles')}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={20}
            color={'black'}
            style={styles.image1}
          />
        </TouchableOpacity>
        <ScrollView>
          <Text style={styles.titleText}>Edit Article</Text>
          <Text style={styles.labelText}>Title</Text>
          <TextInput
            style={styles.inputContainer}
            value={title}
            onChangeText={text => setTitle(text)}
          />
          <Text style={styles.labelText}>Categories</Text>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
              <Picker.Item label="Select Category" value="" />
              {categories.map(cat => (
                <Picker.Item key={cat.id} label={cat.title} value={cat.id} />
              ))}
            </Picker>
          </View>
          <Text style={styles.labelText}>Image</Text>
          <TouchableOpacity
            style={[styles.inputContainer, styles.imageInput]}
            onPress={handleImageUpload}>
            {imageUri ? (
              <Image source={{uri: imageUri}} style={styles.imagePreview} />
            ) : (
              <Text>Select Image</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.labelText}>Content</Text>
          <TextInput
            style={[styles.inputContainer, styles.contentInput]}
            multiline={true}
            value={content}
            onChangeText={text => setContent(text)}
          />
          <TouchableOpacity style={styles.footerImage} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <FontAwesomeIcon icon={faPlus} size={20} color={'black'} />
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
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
    paddingBottom: 77,
  },
  image1: {
    width: 10,
    height: 15,
    marginBottom: 53,
    marginHorizontal: 16,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 18,
    marginLeft: 37,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 13,
    marginLeft: 26,
  },
  inputContainer: {
    height: 60,
    backgroundColor: '#BFBFBF',
    borderRadius: 25,
    marginBottom: 17,
    marginHorizontal: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  imageInput: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  contentInput: {
    height: 195,
    marginBottom: 15,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  footerImage: {
    width: 43,
    height: 42,
    alignSelf: 'flex-end',
    margin: 30,
  },
});

export default EditArticleScreen;
