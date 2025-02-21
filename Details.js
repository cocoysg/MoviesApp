import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, View, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Text, Image, Button } from '@rneui/themed'; // Component library we are using in Capstone
import { fetchDetails } from './App';

// Component for details
export default function Details({ route, navigation }) {
  const { id, mediaType } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load details using the media/movie ID
  useEffect(() => {
    const loadDetails = async () => {
      const data = await fetchDetails(id, mediaType);
      setDetails(data);
      setLoading(false);
    };
    loadDetails();
  }, [id, mediaType]);

  return (
    <View style={{ flex: 1 }}>

      {/* Header with title and back button */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'< Back to List'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {details ? (details.title || details.name) : ''}
        </Text>
      </View>

      {/* Display loading icon and details */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#283647" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.contentTitle}>
            {details.title || details.name}
          </Text>

          {/* Display thumbnail */}
          <Image
            source={{
              uri: details.poster_path
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : 'https://via.placeholder.com/200x300.png?text=No+Image',
            }}
            style={styles.thumbnail}
          />

          {/* Display details */}
          <Text style={styles.overview}>{details.overview}</Text>
          <Text style={styles.info}>
            Popularity: {details.popularity} | Release Date: {details.release_date || details.first_air_date}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

// Details Page Styles
const styles = StyleSheet.create({
  header: { display: 'flex', backgroundColor: '#fff', padding: 16, flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#05adcd', fontSize: 16, marginRight: 10, top: 8 },
  headerTitle: { color: '#283647', fontSize: 20, fontWeight: 'bold', top: 7 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentContainer: { padding: 16, alignItems: 'center' },
  contentTitle: { fontSize: 24, color: '#283647', textAlign: 'center', marginBottom: 16, fontWeight: 'bold', marginTop: 20 },
  thumbnail: { width: 200, height: 300, marginBottom: 16 },
  overview: { fontSize: 16, color: '#283647', textAlign: 'left', width: '100%', marginBottom: 16 },
  info: { fontSize: 16, color: '#283647', alignSelf: 'flex-start' },
});
