import React from 'react';
import { StyleSheet, View, TextInput, Text, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import { Constants } from 'expo'
import { API_KEY } from './config.js'

export default class Search extends React.Component {

  state = {
    search: '',
    apiRes: '',
  }

  handleSearchInput = search => {
    this.setState({search})
  }

  componentDidUpdate(prevProps, prevState){
    let self = this
    if (prevState.search !== this.state.search){
      console.log(encodeURIComponent(this.state.search))
      let search
      if (this.state.search[this.state.search.length-1] === ' '){
        search = this.state.search.slice(0, -1)
      } else {
        search = this.state.search
      }
      let req = "http://www.omdbapi.com/?apikey=" + API_KEY + "&s=" + encodeURIComponent(search)

      //if state is different to prevState, make api call
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let parsed = JSON.parse(this.responseText)

            if (parsed.Response === "False"){
              self.setState({
                apiRes: '',
              })
            } else {
              //map over each result in Search and give it a key
              parsed = parsed.Search
              let result = parsed.map(function(obj) {
                let o = Object.assign({}, obj);
                o.key = obj.imdbID
                return o
              })
              console.log(result)
                self.setState({
                  apiRes: result,
                })
            }
         }
      };

      xhttp.open("GET", req , true);
      xhttp.send()
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={this.state.search}
          onChangeText={this.handleSearchInput}
          placeholder="Search"
        />
        {this.state.apiRes !== '' && (
          <FlatList
            data={[...this.state.apiRes]}
            renderItem={({item}) => (
              <ScrollView contentContainerStyle={styles.list}>
                <TouchableOpacity onPress={() => this.props.navCallback(item.Title, item.Year, item.Poster)}>
                  <Image
                    style={styles.poster}
                    source={{uri: item.Poster}}
                  />
                </TouchableOpacity>
                <Text style={styles.movie} onPress={() => this.props.navCallback(item.Title, item.Year, item.Poster)}>{item.Title}</Text>
              </ScrollView>
            )}
          />
        )}
        {this.state.apiRes === '' && (
          <Text>No Results</Text>
        )}

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
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    width: 275,
  },
  poster: {
    width: 50,
    height: 80,
    paddingHorizontal: 5,
    backgroundColor: 'grey',
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  movie: {
    height: 80,
    width: 250,
    marginVertical: 5,
    marginHorizontal: 5,
    flexWrap: 'wrap'
  },
});
