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
          return;
        }
        const currentUserId = currentUser.uid;

        // Fetch videos uploaded by the current user
        const videoQuerySnapshot = await firestore()
          .collection('Video')
          .where('id_users', '==', currentUserId)
          .get();
        const videoDataArray = videoQuerySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch users
        const userIds = [...new Set(videoDataArray.map(item => item.id_users))];
        const userPromises = userIds.map(async userId => {
          const userDoc = await firestore()
            .collection('Users')
            .doc(userId)
            .get();
          return {id: userId, ...userDoc.data()};
        });
        const userDataArray = await Promise.all(userPromises);

        // Merge video data with uploader info
        const mergedDataArray = videoDataArray.map(video => {
          const uploaderData = userDataArray.find(
            user => user.id === video.id_users,
          );
          return {
            ...video,
            uploader: uploaderData ? uploaderData.fullname : 'Unknown', // assuming 'fullname' field in users collection
          };
        });

        setData(mergedDataArray.reverse()); // Reverse the data to show the latest items first
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

  const handleDelete = async id => {
    try {
      await firestore().collection('Video').doc(id).delete();
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error('Error deleting video: ', error);
    }
  };

  const handleEdit = id => {
    navigation.navigate('EditVideo', {videoId: id});
  };

  const renderItem = ({item, index}) => (
    <View style={styles.row}>
      <Text style={styles.rowText1}>
        {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
      </Text>
      <Text style={styles.rowText2}>{truncateText(item.title, 10)}</Text>
      <Text style={styles.rowText2}>{item.uploader}</Text>
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

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    } else {
      return text;
    }
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
          <Text style={styles.headerText}>Video</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddVideo')}>
            <FontAwesomeIcon icon={faPlus} size={20} color={'black'} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentView}>
          <View style={styles.contentBackground}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16} // Adjust scroll event frequency
            >
              <View style={styles.contentRow}>
                <Text style={styles.contentText}>No</Text>
                <Text style={styles.contentSubText}>Title</Text>
                <Text style={styles.contentSubText}>Uploader</Text>
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
    gap: 10,
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
    marginRight: 20,
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
    marginRight: 20,
    gap: 7,
  },
  rowText1: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 20,
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
    marginLeft: 20,
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
