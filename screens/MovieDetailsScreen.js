import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import { Constants } from 'expo'
import { API_KEY } from '../config.js'

export default class MovieDetails extends React.Component {
  state = {
    title: this.props.navigation.state.params.title,
    apiRes: ''
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Movie Details',
    };
  };

  componentDidMount(){

      let req = "http://www.omdbapi.com/?apikey=" + API_KEY + "&t=" + this.state.title
      let self = this
      //if state is different to prevState, make api call
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            //map over each result in Search and give it a key
            let parsed = JSON.parse(this.responseText)
              self.setState({
                apiRes: parsed,
              })
         }
      };

      xhttp.open("GET", req , true);
      xhttp.send()
    }



  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.navigation.state.params.title}</Text>
        <Text>{this.props.navigation.state.params.year}</Text>
        <Image
          style={styles.poster}
          source={{uri: this.props.navigation.state.params.poster}}
        />
        <Text>{this.state.apiRes.Plot}</Text>
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
  poster: {
    borderWidth: 2,
    width: 40,
    height: 80,
  }
});
