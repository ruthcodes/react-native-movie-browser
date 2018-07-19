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
      headerTitle: navigation.state.params.title,
      headerStyle: {
        backgroundColor: '#ccc',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  componentDidMount(){

      let req = "http://www.omdbapi.com/?apikey=" + API_KEY + "&t=" + encodeURIComponent(this.state.title)
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
        <Image
          style={styles.poster}
          source={{uri: this.props.navigation.state.params.poster}}
        />
        <View style={styles.details}>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 5,}}>{this.props.navigation.state.params.title}</Text>
          <Text style={{marginVertical: 5}}>{this.props.navigation.state.params.year}</Text>
          <Text>{this.state.apiRes.Plot}</Text>
        </View>
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
    width: 300,
    height: 300,
  },
  details: {
    alignItems: 'flex-start',
    marginVertical: 20,
    marginHorizontal: 20,
  }
});
