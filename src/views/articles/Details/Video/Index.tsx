import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Header from '../../../../components/Header';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
import YoutubePlayer from 'react-native-youtube-iframe';

const Index = ({route, navigation}) => {
  const {videoId} = route.params; // Dapatkan ID video dari parameter rute
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoRef = firestore().collection('Video').doc(videoId);
        const videoDoc = await videoRef.get();

        if (!videoDoc.exists) {
          Alert.alert(
            'Video not found',
            'The requested video could not be found.',
          );
        } else {
          const videoData = videoDoc.data();
          setVideo(videoData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching video:', error);
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading || !video) {
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
        <YoutubePlayer
          height={300}
          play={true}
          videoId={video.link.split('v=')[1]} // Ekstrak video ID dari URL
        />
        <Text style={styles.heading}>{video.title}</Text>
        <Text style={styles.description}>{video.content}</Text>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: '#333647',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 35,
    marginHorizontal: 12,
    width: 336,
  },
  description: {
    color: '#666C8E',
    fontSize: 16,
    marginHorizontal: 12,
    marginBottom: 20,
  },
  smallImage: {
    width: 11,
    height: 12,
    marginBottom: 30,
    marginHorizontal: 18,
  },
});

export default Index;
