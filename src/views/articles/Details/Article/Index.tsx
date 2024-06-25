import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import Header from '../../../../components/Header';
import firestore from '@react-native-firebase/firestore';

const Index = ({route, navigation}) => {
  const {articleId} = route.params;
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const randomProfileImage = 'https://randomuser.me/api/portraits/men/1.jpg'; // Gambar profil acak

  useEffect(() => {
    const fetchArticleAndAuthorAndCategory = async () => {
      try {
        const articleRef = firestore().collection('Article').doc(articleId);
        const articleDoc = await articleRef.get();

        if (!articleDoc.exists) {
          console.log('No such document!');
        } else {
          const articleData = articleDoc.data();
          setArticle(articleData);

          // // Update views count
          // await articleRef.update({
          //   views: articleData.views + 1, // Increment views by 1
          // });

          // Fetch author data
          const authorRef = firestore()
            .collection('Users')
            .doc(articleData.id_users);
          const authorDoc = await authorRef.get();

          if (authorDoc.exists) {
            setAuthor(authorDoc.data());
          }

          // Fetch category data
          const categoryRef = firestore()
            .collection('Category')
            .doc(articleData.id_category);
          const categoryDoc = await categoryRef.get();

          if (categoryDoc.exists) {
            setCategory(categoryDoc.data());
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article, author, or category: ', error);
        setLoading(false);
      }
    };

    fetchArticleAndAuthorAndCategory();
  }, [articleId]);

  if (loading || !article) {
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.smallImage}>
          <FontAwesomeIcon icon={faChevronLeft} size={20} color={'black'} />
        </TouchableOpacity>
        <Image
          source={{uri: article.image}}
          resizeMode="stretch"
          style={styles.largeImage}
        />
        <View style={styles.reviewButton}>
          <Text style={styles.reviewText}>
            {category ? category.title : 'Unknown Category'}
          </Text>
        </View>
        <Text style={styles.heading}>{article.title}</Text>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: author && author.image ? author.image : randomProfileImage,
            }}
            resizeMode="stretch"
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {author ? author.fullname : 'Anonymous'}
            </Text>
            <Text style={styles.profileRole}>Editor</Text>
          </View>
        </View>
        <Text style={styles.resultsTitle}>Results</Text>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>{article.content}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
  },
  smallImage: {
    width: 11,
    height: 12,
    marginBottom: 30,
    marginHorizontal: 18,
  },
  largeImage: {
    borderRadius: 16,
    height: 192,
    marginBottom: 22,
    marginHorizontal: 12,
  },
  reviewButton: {
    width: 84,
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#CE304D',
    borderRadius: 30,
    paddingVertical: 10,
    marginBottom: 27,
    marginHorizontal: 12,
  },
  reviewText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  heading: {
    color: '#333647',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 35,
    marginHorizontal: 12,
    width: 336,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 38,
    marginHorizontal: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    marginRight: 16,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#333647',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileRole: {
    color: '#7C81A1',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 1,
  },
  resultsTitle: {
    color: '#333647',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 13,
  },
  resultsContainer: {
    marginHorizontal: 15,
    marginVertical: 30,
  },
  resultsText: {
    color: '#666C8E',
    fontSize: 16,
    width: 336,
  },
});

export default Index;
