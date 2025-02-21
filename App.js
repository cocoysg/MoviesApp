import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Header } from '@rneui/themed'; // Component library we are using in Capstone
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Import the 4 pages
import Movies from './Movies';
import SearchResults from './SearchResults';
import TVShows from './TVShows';
import Details from './Details';

// Create navigators for tab and stack navigation
const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

// Title header
function CustomHeader({ title }) {
  return (
    <Header
      containerStyle={styles.headerContainer}
      centerComponent={{ text: title, style: styles.centerText }}
    />
  );
}

// Create the 3 tabs
function HomeTabs() {
  return (
    <>
      <CustomHeader title="Movies App" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#283647',
          tabBarIndicatorStyle: { backgroundColor: '#283647' },
        }}
      >
        <Tab.Screen name="Movies" component={Movies} />
        <Tab.Screen name="Search Results" component={SearchResults} />
        <Tab.Screen name="TV Shows" component={TVShows} />
      </Tab.Navigator>
    </>
  );
}

// Main App navigation, display within device boundary
export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="Home" component={HomeTabs} />
          <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

// Create variabels for API key and base URL
const API_KEY = 'd0d2df5c4b5700d455ab5eb389081f36';
const BASE_URL = 'https://api.themoviedb.org/3';

// Fetch Movies
export async function fetchMovies(endpoint) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch TVShows
export async function fetchTVShows(endpoint) {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${endpoint}?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch Search Results
export async function fetchSearchResults(query, searchType) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/${searchType}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch Details, use only media/movie ID
export async function fetchDetails(id, mediaType = 'movie') {
  try {
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Home Page Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#283647' },
  headerContainer: { backgroundColor: '#283647' },
  centerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
