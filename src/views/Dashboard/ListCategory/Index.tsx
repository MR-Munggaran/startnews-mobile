import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faChevronLeft,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';

const ITEMS_PER_PAGE = 5;

const MyComponent = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await firestore().collection('Category').get();
        const dataArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(dataArray.reverse()); // Reverse the data to show the latest items first
        setTotalPages(Math.ceil(dataArray.length / ITEMS_PER_PAGE));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteItem = async id => {
    try {
      await firestore().collection('Category').doc(id).delete();
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      setTotalPages(Math.ceil(updatedData.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error deleting item: ', error);
    }
  };

  const renderItem = ({item, index}) => (
    <View style={styles.dataRow}>
      <Text style={styles.dataText}>
        {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
      </Text>
      <Text style={[styles.dataText]}>{item.title}</Text>
      <TouchableOpacity onPress={() => deleteItem(item.id)}>
        <FontAwesomeIcon
          icon={faTrash}
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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={20}
            color={'black'}
            style={styles.logo}
          />
        </TouchableOpacity>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Category</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddCategory')}>
            <FontAwesomeIcon icon={faPlus} size={20} color={'black'} />
          </TouchableOpacity>
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.dataRow}>
            <Text style={styles.dataText}>No</Text>
            <Text style={[styles.dataText]}>Judul</Text>
            <Text style={styles.dataText}>Action</Text>
          </View>
          <FlatList
            data={currentPageData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.flatListContainer}
          />
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
              currentPage === totalPages ? styles.disabledButton : styles.button
            }>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 94,
    paddingHorizontal: 14,
  },
  logo: {
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
  dataContainer: {
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingTop: 13,
    paddingHorizontal: 36,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
    gap: 30,
  },
  dataText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  rowIcon: {
    marginLeft: 20,
  },
  flatListContainer: {
    paddingTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default MyComponent;
