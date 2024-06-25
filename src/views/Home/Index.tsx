import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
import firestore from '@react-native-firebase/firestore';
import Swiper from 'react-native-swiper';

const Home = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [carouselArticles, setCarouselArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoryUnsubscribe = firestore()
      .collection('Category')
      .onSnapshot(querySnapshot => {
        const categoryList = [];
        querySnapshot.forEach(documentSnapshot => {
          categoryList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setCategories(categoryList);
      });

    const articleUnsubscribe = firestore()
      .collection('Article')
      .onSnapshot(querySnapshot => {
        const articleList = [];
        querySnapshot.forEach(documentSnapshot => {
          articleList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });

        // Map articles to include category name
        const articlesWithCategoryName = articleList.map(article => {
          const category = categories.find(
            cat => cat.id === article.id_category,
          );
          return {
            ...article,
            categoryName: category ? category.title : 'Unknown Category',
          };
        });

        // Sort articles by date for the latest news
        const sortedByDate = [...articlesWithCategoryName]
          .sort((a, b) => b.created_at.toMillis() - a.created_at.toMillis())
          .slice(0, 5);

        // Sort articles by views for the carousel
        const sortedByViews = [...articlesWithCategoryName]
          .sort((a, b) => b.views - a.views)
          .slice(0, 3);

        setLatestArticles(sortedByDate);
        setCarouselArticles(sortedByViews);
        setLoading(false);
      });

    return () => {
      categoryUnsubscribe();
      articleUnsubscribe();
    };
  }, [categories]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      style={styles.horizontalScrollItem}
      onPress={() =>
        navigation.navigate('Category', {
          categoryId: item.id,
          categoryName: item.title,
        })
      }>
      <Text style={styles.horizontalScrollText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderArticleItem = ({item}) => (
    <TouchableOpacity
      style={styles.newsItemContainer}
      onPress={() => navigation.navigate('Details', {articleId: item.id})}>
      <Image
        source={{uri: item.image}}
        resizeMode="stretch"
        style={styles.newsItemImage}
      />
      <View style={styles.newsItemTextContainer}>
        <Text style={styles.newsItemCategory}>{item.categoryName}</Text>
        <Text style={styles.newsItemTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={latestArticles}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <View>
            <Header />
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={renderCategoryItem}
              style={styles.horizontalScrollView}
            />
            <Swiper
              style={styles.wrapper}
              showsButtons={false}
              autoplay
              autoplayTimeout={3}
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}>
              {carouselArticles.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.carousel}
                  onPress={() =>
                    navigation.navigate('Details', {articleId: item.id})
                  }>
                  <Image style={styles.image} source={{uri: item.image}} />
                </TouchableOpacity>
              ))}
            </Swiper>
            <View style={styles.newsHeaderContainer}>
              <Text style={styles.newsHeader}>Latest News</Text>
            </View>
          </View>
        }
        renderItem={renderArticleItem}
      />
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
  headerContainer: {
    marginBottom: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackground: {
    position: 'absolute',
    width: '100%',
    height: 57,
    backgroundColor: '#262424',
    borderRadius: 5,
  },
  headerText: {
    color: '#BC1D3A',
    fontSize: 40,
    fontWeight: 'bold',
    zIndex: 1,
    textAlign: 'center',
  },
  horizontalScrollView: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  horizontalScrollItem: {
    width: 84,
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#CE304D',
    borderRadius: 30,
    paddingVertical: 10,
    marginRight: 18,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  horizontalScrollText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  mainImage: {
    borderRadius: 10,
    height: 200,
    marginBottom: 59,
    marginHorizontal: 18,
  },
  newsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 23,
    marginTop: 20,
    marginHorizontal: 14,
  },
  newsHeader: {
    color: '#333647',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#7C81A1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  newsItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 12,
  },
  newsItemImage: {
    borderRadius: 12,
    width: 96,
    height: 96,
  },
  newsItemTextContainer: {
    width: 219,
  },
  newsItemCategory: {
    color: '#7C81A1',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  newsItemTitle: {
    color: '#333647',
    fontSize: 16,
    fontWeight: 'bold',
  },
  carousel: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width / 2,
    marginHorizontal: 20,
    borderRadius: 30,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wrapper: {
    height: Dimensions.get('window').width / 2,
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#007aff',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  carouselList: {
    marginBottom: 20,
  },
});

export default Home;
