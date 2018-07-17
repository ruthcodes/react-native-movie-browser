import React from 'react';
import { StyleSheet, View, TextInput, Text, FlatList, Image, ScrollView } from 'react-native';
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
    if (prevState.search !== this.state.search && this.state.search.length > 3){

      let req = "http://www.omdbapi.com/?apikey=" + API_KEY + "&s=" + this.state.search

      //if state is different to prevState, make api call
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            //map over each result in Search and give it a key
            let parsed = JSON.parse(this.responseText)
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
        <Text style={styles.listItem} onPress={() => this.props.navCallback()}>Click me for the details</Text>
        <Text>{this.state.search}</Text>
        {this.state.apiRes !== '' && (
          <FlatList

            data={[...this.state.apiRes]}
            renderItem={({item}) => (
              <ScrollView>

                <Text onPress={() => this.props.navCallback(item.Title, item.Year, item.Poster)}>{item.Title}</Text>
                <Image
                  style={styles.poster}
                  source={{uri: item.Poster}}
                />
              </ScrollView>
            )}
          />
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
