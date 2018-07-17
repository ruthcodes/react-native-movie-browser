import React from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';

import { Constants } from 'expo'

import Search from "../Search"

export default class SearchScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Search for Movies',
    };
  };

navCallback = (title, year, poster) => {

  this.props.navigation.navigate('MovieDetails', {
              title: title,
              year: year,
              poster: poster,
            });

}

  render() {
    return (
      <View style={styles.container}>
        <Search navCallback={this.navCallback}/>

      </View>
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
  listItem: {
    paddingTop: 15,
  }
});
