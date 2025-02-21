import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, Modal, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Text, Input, Image, Button, Icon } from '@rneui/themed'; // Component library we are using in Capstone
import { fetchSearchResults } from './App';

// API endpoints used for Search
const searchOptions = ['movie', 'multi', 'tv'];

// Component for search and show results
export default function SearchResults({ navigation }) {
  const [query, setQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState('movie'); // Default search type
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchOptionsVisible, setSearchOptionsVisible] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  // Load SearchResults based on selected option
  const loadSearch = async () => {
    if (query.trim() === '') return;
    setLoading(true);
    const res = await fetchSearchResults(query, selectedOption);
    setResults(res);
    setSearched(true);
    setLoading(false);
    setShowAllItems(false);
    Keyboard.dismiss();
  };

  // Function to display more details, passing only movie/media ID
  const moreDetails = (item) => {
    const mediaType = item.media_type ? item.media_type : 'movie';
    navigation.navigate('Details', { id: item.id, mediaType });
  };

  // Display 10 items or show all
  const itemsToShow = showAllItems ? results : results.slice(0, 10);

  return (
    <View style={styles.container}>

      {/* Search label and input */}
      <View style={styles.group}>
        <Text style={styles.label1}>
          Search Movie/TV Show Name
          <Text style={styles.asterisk}>*</Text>
        </Text>
        <Input
          placeholder="i.e. James Bond, CSI"
          value={query}
          onChangeText={setQuery}
          inputContainerStyle={styles.input}
          inputStyle={styles.placeholder}
          leftIcon={<Icon type="font-awesome" name="search" color="#283647" size={16} />}
        />
      </View>

      {/* Search type label and button */}
      <Text style={styles.label2}>Choose Search Type</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setSearchOptionsVisible(true)} style={styles.searchTypeButton}>
          <Text style={styles.searchTypeText}>{selectedOption}</Text>
          <Icon type="font-awesome" name="angle-down" color="#000" size={20} />
        </TouchableOpacity>
        <Button
          title="Search"
          buttonStyle={styles.searchButton}
          onPress={loadSearch}
          icon={<Icon type="font-awesome" name="search" color="#fff" size={16} paddingRight={8} />}
        />
      </View>

      {/* Display secondary text */}
      <Text style={styles.smallText}>Please select a search type</Text>

      {/* Slide-up modal for search type options */}
      <Modal
        visible={searchOptionsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSearchOptionsVisible(false)}
      >
        {/* Enable clicking outside the modal to dismiss */}
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSearchOptionsVisible(false)}>
          <View style={styles.modalContent}>

            {/* Display search type options */}
            {searchOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, option === selectedOption && styles.selectedOption]}
                onPress={() => {
                  setSelectedOption(option);
                  setSearchOptionsVisible(false);
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
      <View style={styles.searchResultsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#283647" />
          </View>
        ) : !searched ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.initiateText}>Please initiate a search</Text>
          </View>
        ) : (
          <FlatList
            data={itemsToShow}
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
                  <Text style={styles.itemTitle}>{item.title || item.name}</Text>
                  <Text style={styles.itemText}>Popularity: {item.popularity}</Text>
                  <Text style={styles.itemText}>
                    Release Date: {item.release_date || item.first_air_date}
                  </Text>
                  <Button title="More Details" buttonStyle={styles.detailsButton} onPress={() => moreDetails(item)} />
                </View>
              </View>
            )}

            // Button to display all
            ListFooterComponent={() =>
              !showAllItems && results.length > 10 ? (
                <Button title="Display All" buttonStyle={styles.displayAllButton} onPress={() => setShowAllItems(true)} />
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}

// Search Results Page Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  group: { display: 'flex', alignItems: 'start', alignSelf: 'center'},
  label1: { fontSize: 16, color: '#283647', marginBottom: 4, paddingLeft: 12, paddingTop: 10 },
  label2: { fontSize: 16, color: '#283647', marginBottom: -6, paddingLeft: 32 },
  input: { borderWidth: 1, borderColor: '#ccc', paddingLeft: 10, paddingRight: 8, borderRadius: 4, marginBottom: -10, width: 300 },
  placeholder: { fontSize: 16 },
  asterisk: { color: 'red' },
  inputContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginBottom: 10 },
  row: { flexDirection: 'row', marginBottom: 8, justifyContent: 'center' },
  searchTypeButton: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4, marginBottom: 20, marginTop: 10, width: 180, marginRight: 10 },
  searchTypeText: { fontSize: 16, color: '#283647' },
  searchButton: { backgroundColor: '#05adcd', paddingLeft: 20, paddingRight: 20, top: 10, height: 44, borderRadius: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20 },
  optionItem: { padding: 10 },
  selectedOption: { backgroundColor: '#0c7065', borderRadius: 4 },
  optionText: { fontSize: 16, color: '#283647' },
  selectedOptionText: { color: '#fff' },
  smallText: { fontSize: 12, color: '#283647', top: -20, left: 32 },
  searchResultsContainer: { flex: 1, marginTop: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  initiateText: { fontSize: 20, color: '#283647', fontWeight: 'bold' },
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
