import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
import firestore from '@react-native-firebase/firestore';

const Index = ({navigation}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosSnapshot = await firestore()
          .collection('Video')
          .orderBy('created_at', 'desc')
          .limit(5)
          .get();

        const videoList = [];
        videosSnapshot.forEach(documentSnapshot => {
          videoList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });

        setVideos(videoList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos: ', error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

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
        <Text style={styles.title}>Video</Text>
        {videos.map(video => (
          <TouchableOpacity
            key={video.id}
            style={styles.cardContainer}
            onPress={() =>
              navigation.navigate('VideoView', {videoId: video.id})
            }>
            <Image
              source={{uri: video.image}}
              resizeMode={'stretch'}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>{video.title}</Text>
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
    borderRadius: 19,
  },
  title: {
    color: '#333647',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 26,
    marginLeft: 12,
    marginTop: 20,
  },
  cardContainer: {
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
});

export default Index;
