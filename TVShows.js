import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Image, Button, Icon } from '@rneui/themed'; // Component library we are using in Capstone
import { fetchTVShows } from './App';

// API endpoints used for TVShows
const tvOptions = ['airing_today', 'on_the_air', 'popular', 'top_rated'];

// Component for TVShows listing
export default function TVShows({ navigation }) {
  const [selectedOption, setSelectedOption] = useState('airing_today'); // Default tv option
  const [tvShows, setTVShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tvOptionsVisible, setTvOptionsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Load TVShows based on selected option
  const loadTVShows = async (option) => {
    setLoading(true);
    const results = await fetchTVShows(option);
    setTVShows(results);
    setLoading(false);
    setShowAll(false);
  };
  useEffect(() => {
    loadTVShows(selectedOption);
  }, [selectedOption]);

  // Load Details page with selected tv ID
  const moreDetails = (id) => {
    navigation.navigate('Details', { id, mediaType: 'tv' });
  };

  // Display 10 items or show all
  const dataToShow = showAll ? tvShows : tvShows.slice(0, 10);

  return (
    <View style={styles.container}>

      {/* TVShows options button */}
      <TouchableOpacity onPress={() => setTvOptionsVisible(true)} style={styles.tvShowsButton}>
        <Text style={styles.tvShowsText}>{selectedOption}</Text>
        <Icon type="font-awesome" name="angle-down" color="#000" size={20} />
      </TouchableOpacity>

      {/* Slide-up modal for tvshows options */}
      <Modal
        visible={tvOptionsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTvOptionsVisible(false)}
      >
        {/* Enable clicking outside the modal to dismiss */}
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setTvOptionsVisible(false)}>
          <View style={styles.modalContent}>

            {/* Display tvshows options */}
            {tvOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, option === selectedOption && styles.selectedOption]}
                onPress={() => {
                  setSelectedOption(option);
                  setTvOptionsVisible(false);
                }}
              >
                <View style={styles.optionRow}>

                  {/* Highlight selected option */}
                  <Text style={[styles.optionText, option === selectedOption && styles.selectedOptionText]}>
                    {option}
                  </Text>

                  {/* Display check icon for selected option */}
                  {option === selectedOption && (
                    <Icon 
                      type="font-awesome" 
                      name="check" 
                      color="#fff" 
                      size={16} 
                      containerStyle={styles.checkMargin}
                    />
                  )}
                </View>

              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Display loading icon and results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#283647" />
          <Text style={styles.loadingText}>Loading results</Text>
        </View>
      ) : (
        <FlatList
          data={dataToShow}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>

              {/* Display thumbnail */}
              <Image
                source={{
                  uri: item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : 'https://via.placeholder.com/100x150.png?text=No+Image',
                }}
                style={styles.thumbnail}
              />

              {/* Display details */}
              <View style={styles.detailsContainer}>
                <Text style={styles.itemTitle}>{item.name || item.title}</Text>
                <Text style={styles.itemText}>Popularity: {item.popularity}</Text>
                <Text style={styles.itemText}>
                  Release Date: {item.first_air_date || item.release_date}
                </Text>
                <Button title="More Details" buttonStyle={styles.detailsButton} onPress={() => moreDetails(item.id)} />
              </View>
            </View>
          )}

          // Button to display all
          ListFooterComponent={() =>
            !showAll && tvShows.length > 10 ? (
              <Button title="Display All" buttonStyle={styles.displayAllButton} onPress={() => setShowAll(true)} />
            ) : null
          }
        />
      )}
    </View>
  );
}

// TVShows Page Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  tvShowsButton: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4, marginBottom: 20, marginTop: 10, width: 200 },
  tvShowsText: { fontSize: 16, color: '#283647' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20 },
  optionItem: { padding: 10 },
  selectedOption: { backgroundColor: '#0c7065', borderRadius: 4 },
  optionText: { fontSize: 16, color: '#283647' },
  selectedOptionText: { color: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, color: '#283647' },
  itemContainer: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 8, marginBottom: 8 },
  thumbnail: { width: 100, height: 150 },
  detailsContainer: { flex: 1, marginLeft: 8, justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#283647', marginBottom: 4 },
  itemText: { fontSize: 14, color: '#283647', marginBottom: 4 },
  detailsButton: { backgroundColor: '#05adcd', padding: 10, borderRadius: 4 },
  displayAllButton: { backgroundColor: '#05adcd', marginTop: 10 },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
  checkMargin: { marginLeft: 5},
});
