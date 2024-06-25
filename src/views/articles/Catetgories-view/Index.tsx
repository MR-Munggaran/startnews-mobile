import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Header from '../../../components/Header';
import firestore from '@react-native-firebase/firestore';

const Category = ({route, navigation}) => {
  const {categoryId, categoryName} = route.params;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articleCollection = await firestore()
          .collection('Article') // Pastikan nama koleksi adalah 'Article'
          .where('id_category', '==', categoryId)
          .get();
        const articleData = articleCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articleData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles: ', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryId]);

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
        <Text style={styles.categoryTitle}>{categoryName}</Text>
        {articles.length === 0 ? (
          <Text style={styles.noArticlesText}>
            No articles found for this category.
          </Text>
        ) : (
          articles.map(article => (
            <TouchableOpacity
              key={article.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('Details', {articleId: article.id})
              }>
              <Image
                source={{uri: article.image}}
                resizeMode="stretch"
                style={styles.cardImage}
              />
              <Text style={styles.cardText}>{article.title}</Text>
            </TouchableOpacity>
          ))
        )}
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
    paddingBottom: -193,
  },
  categoryTitle: {
    color: '#333647',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    marginLeft: 15,
  },
  card: {
    borderColor: '#F3F3F6',
    borderRadius: 16,
    borderWidth: 1,
    paddingBottom: 10,
    marginBottom: 34,
    marginHorizontal: 12,
  },
  cardImage: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 192,
    marginBottom: 22,
  },
  cardText: {
    color: '#333647',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    width: 302,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noArticlesText: {
    textAlign: 'center',
    color: '#333647',
    fontSize: 18,
    marginTop: 20,
  },
});

export default Category;
