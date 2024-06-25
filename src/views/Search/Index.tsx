import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';

export default ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesSnapshot = await firestore().collection('Article').get();
        const articleList = [];
        articlesSnapshot.forEach(documentSnapshot => {
          articleList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setArticles(articleList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles: ', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles based on search text
  const filteredArticles = articles.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const articlesToDisplay = searchText
    ? filteredArticles
    : articles.slice(0, 3);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header />
        <Text style={styles.browseText}>Browse</Text>
        <View style={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} size={20} color={'black'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        {articlesToDisplay.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.cardContainer}
            onPress={() =>
              navigation.navigate('Details', {articleId: item.id})
            }>
            <Image
              source={{uri: item.image}}
              resizeMode={'stretch'}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  browseText: {
    color: '#333647',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 52,
    marginLeft: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 17,
    marginBottom: 36,
    marginHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    color: '#7C81A1',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  cardContainer: {
    borderColor: '#F3F3F6',
    borderRadius: 16,
    borderWidth: 1,
    paddingBottom: 11,
    marginBottom: 36,
    marginHorizontal: 11,
  },
  cardImage: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 192,
    marginBottom: 21,
  },
  cardText: {
    color: '#333647',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 5,
  },
});
