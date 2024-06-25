import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/Header';
import firestore from '@react-native-firebase/firestore';

const CategoryScreen = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = await firestore()
          .collection('Category')
          .get();
        const categoryData = categoryCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories: ', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const renderCategories = () => {
    const rows = [];
    const itemsPerRow = 3; // Number of items per row

    for (let i = 0; i < categories.length; i += itemsPerRow) {
      const rowItems = categories.slice(i, i + itemsPerRow);
      rows.push(
        <View style={styles.row} key={`row-${i}`}>
          {rowItems.map(category => (
            <TouchableOpacity
              style={styles.actionButton}
              key={category.id}
              onPress={() =>
                navigation.navigate('Category', {
                  categoryId: category.id,
                })
              }>
              <Text style={styles.actionButtonText}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>,
      );
    }

    return rows;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <Header />
        <Text style={styles.categoryText}>{'Category'}</Text>
        {renderCategories()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
  },
  categoryText: {
    color: '#333647',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 13,
    marginTop: 30,
    marginBottom: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 13,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#CE304D',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 5, // Add margin to separate items in the row
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryScreen;
