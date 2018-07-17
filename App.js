import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import { Constants } from 'expo'

import SearchScreen from "./screens/SearchScreen"
import MovieDetailsScreen from "./screens/MovieDetailsScreen"

const MainStack = createStackNavigator(
  {
    Search: SearchScreen,
    MovieDetails: MovieDetailsScreen,
  },
  {
    initialRouteName: "Search",
    navigationOptions: {
      headerTintColor: "#a41034",
      headerStyle: {
        backgroundColor: "#fff"
      }
    }
  }
);




export default class App extends React.Component {
  state = {
    search: '',
  }


  handleSearch = search => {
    this.setState({search})
  }


  render() {
    return (
      <MainStack />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    minWidth: 100,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
});
