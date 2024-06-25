import React, {useRef, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faChevronLeft,
  faTrash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ITEMS_PER_PAGE = 5;

const MyComponent = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current user's ID
        const currentUser = auth().currentUser;
        if (!currentUser) {
          console.error('No user is currently logged in.');
          setLoading(false);
          return;
        }
        const currentUserId = currentUser.uid;

        // Fetch articles authored by the current user
        const articlesRef = firestore()
          .collection('Article')
          .where('id_users', '==', currentUserId);
        const snapshot = await articlesRef.get();

        if (snapshot.empty) {
          console.log('No articles available');
          setLoading(false);
          return;
        }

        const articlesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userIds = [...new Set(articlesData.map(item => item.id_users))];
        const categoryIds = [
          ...new Set(articlesData.map(item => item.id_category)),
        ];

        const userPromises = userIds.map(async userId => {
          const userDoc = await firestore()
            .collection('Users')
            .doc(userId)
            .get();
          return {id: userId, ...userDoc.data()};
        });

        const categoryPromises = categoryIds.map(async categoryId => {
          const categoryDoc = await firestore()
            .collection('Category')
            .doc(categoryId)
            .get();
          return {id: categoryId, ...categoryDoc.data()};
        });

        const [userDataArray, categoryDataArray] = await Promise.all([
          Promise.all(userPromises),
          Promise.all(categoryPromises),
        ]);

        const mergedDataArray = articlesData.map(article => {
          const authorData = userDataArray.find(
            user => user.id === article.id_users,
          );
          const categoryData = categoryDataArray.find(
            category => category.id === article.id_category,
          );

          return {
            ...article,
            author: authorData ? authorData.fullname : 'Unknown',
            category: categoryData ? categoryData.title : 'Unknown',
          };
        });

        setData(mergedDataArray.reverse());
        setTotalPages(Math.ceil(mergedDataArray.length / ITEMS_PER_PAGE));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScroll = event => {
    const {contentOffset} = event.nativeEvent;
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: contentOffset.x,
        animated: false,
      });
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength - 3) + '...'
      : text;
  };

  const renderItem = ({item, index}) => (
    <View style={styles.row}>
      <Text style={styles.rowText1}>
        {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
      </Text>
      <Text style={[styles.rowText2, {marginRight: 40}]}>
        {truncateText(item.title, 7)}
      </Text>
      <Text style={[styles.rowText2, {marginRight: 50}]}>
        {truncateText(item.category, 8)}
      </Text>
      <Text style={[styles.rowText2, {marginRight: 50}]}>
        {truncateText(item.author, 8)}
      </Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <FontAwesomeIcon
          icon={faTrash}
          size={20}
          color={'white'}
          style={styles.rowIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleEdit(item.id)}>
        <FontAwesomeIcon
          icon={faEdit}
          size={20}
          color={'white'}
          style={styles.rowIcon}
        />
      </TouchableOpacity>
    </View>
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentPageData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleDelete = async id => {
    try {
      await firestore().collection('Article').doc(id).delete();
      const updatedArticles = data.filter(article => article.id !== id);
      setData(updatedArticles);
    } catch (error) {
      console.error('Error deleting article: ', error);
    }
  };

  const handleEdit = id => {
    navigation.navigate('EditArticle', {articleId: id});
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.scrollView}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={20}
            color={'black'}
            style={styles.image1}
          />
        </TouchableOpacity>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Articles</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddArticle')}>
            <FontAwesomeIcon icon={faPlus} size={20} color={'black'} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentView}>
          <View style={styles.contentBackground}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}>
              <View style={styles.contentRow}>
                <Text style={styles.contentText}>No</Text>
                <Text style={styles.contentSubText}>Title</Text>
                <Text style={styles.contentSubText}>Category</Text>
                <Text style={styles.flexText}>Author</Text>
                <Text style={styles.flexText}>Action</Text>
              </View>
            </ScrollView>
            <ScrollView horizontal>
              <FlatList
                ref={flatListRef}
                data={currentPageData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.contentScroll}
                showsHorizontalScrollIndicator={false}
              />
            </ScrollView>
          </View>
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={handlePreviousPage}
              disabled={currentPage === 1}
              style={currentPage === 1 ? styles.disabledButton : styles.button}>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageText}>
              Page {currentPage} of {totalPages}
            </Text>
            <TouchableOpacity
              onPress={handleNextPage}
              disabled={currentPage === totalPages}
              style={
                currentPage === totalPages
                  ? styles.disabledButton
                  : styles.button
              }>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    paddingBottom: 96,
  },
  image1: {
    width: 10,
    height: 15,
    marginBottom: 53,
    marginHorizontal: 16,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 36,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
  },
  contentView: {
    marginHorizontal: 12,
  },
  contentBackground: {
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingTop: 13,
    paddingBottom: 20,
    paddingHorizontal: 35,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  contentText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 20,
  },
  contentSubText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 30,
  },
  flexText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 20,
  },
  contentScroll: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  rowText1: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 30,
  },
  rowText2: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  rowIcon: {
    width: 25,
    height: 22,
    marginLeft: 10,
    verticalAlign: 'middle',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    backgroundColor: '#BC1D3A',
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#c0c0c0',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  pageText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyComponent;
