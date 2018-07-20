import React from 'react';
import { StyleSheet, View, TextInput, Text, FlatList, Image, ScrollView, TouchableOpacity, Button, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import { Constants } from 'expo'
import { API_KEY } from './config.js'

export default class Search extends React.Component {

  state = {
    search: '',
    apiRes: '',
    pageCounter: 1,
  }

  handleSearchInput = search => {
    this.setState({search})
  }

  makeCall = (who) => {
    let self = this
    let search
    // sanitise search (remove trailing spaces)
    if (this.state.search[this.state.search.length-1] === ' '){
      search = this.state.search.slice(0, -1)
    } else {
      search = this.state.search
    }

    let req = "http://www.omdbapi.com/?apikey=" + API_KEY + "&s=" + encodeURIComponent(search) + "&page=" + this.state.pageCounter

    // make request
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      // if OK
      if (this.readyState == 4 && this.status == 200){
        let parsed = JSON.parse(this.responseText)
        // if response from API is false, there are no values for that search
        if (parsed.Response === "False"){
          // if scroll has requested more responses and you are at the end
          if (!who){
            return 0;
          } else {
            self.setState({
              apiRes: '',
              pageCounter: 1,
            })
          }
        // received a truthy response
        } else {
          //map over each result in Search and give it a key
          parsed = parsed.Search
          let result = parsed.map(function(obj) {
            let o = Object.assign({}, obj);
            o.key = obj.imdbID
            return o
          })
          // if apiRes is empty, update it to be new response
          if (self.state.apiRes === ''){
            self.setState({
              apiRes: result,
              pageCounter: 1,
            })

          } else {
            //increment pageCounter
            self.setState({
              pageCounter: self.state.pageCounter + 1,
            })
            // concat response to current apiRes, filtering out duplicates returned from API
            let final = self.state.apiRes.concat(result)
            function removeDuplicates(originalArray, prop) {
               let newArray = [];
               let lookupObject  = {};

               for(i in originalArray) {
                  lookupObject[originalArray[i][prop]] = originalArray[i];
               }

               for(i in lookupObject) {
                   newArray.push(lookupObject[i]);
               }
                return newArray;
             }
             // new and old API results combined, without dups
             let unique = removeDuplicates(final, "key");

             if (self.state.pageCounter <= 1){
               self.setState({
                 apiRes: result,
               })
             } else {
               self.setState({
                 apiRes: unique,
               })
             }
          }
        }
      }
    }
    // send request
    xhttp.open("GET", req , true);
    xhttp.send()

  }

  componentDidUpdate(prevProps, prevState){
    // moved api call into callback for setState so it always happens after state is updated
    if (prevState.search !== this.state.search && this.state.search[this.state.search.length-1] !== ' '){
      this.setState({
        apiRes: '',
        pageCounter: 1,
      }, function(){
        this.makeCall("update")
      })
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
          <View style={{flex: 6}}>
            <FlatList
              onEndReached={()=> this.makeCall()}
              onEndReachedThreshold = {0.1}
              bounce={false}
              data={[...this.state.apiRes]}
              renderItem={({item}) => (
                <View style={styles.list}>
                  <TouchableOpacity onPress={() => this.props.navCallback(item.Title, item.Year, item.Poster)}>
                    <Image
                      style={styles.poster}
                      source={{uri: item.Poster}}
                    />
                  </TouchableOpacity>
                  <Text style={styles.movie} onPress={() => this.props.navCallback(item.Title, item.Year, item.Poster)}>{item.Title}</Text>
                </View>
              )}
            />
          </View>

        )}
        {this.state.apiRes === '' && (
          <View>
            <Text>No Results</Text>
          </View>
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
    width: 300,
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
    width: 300,
    height: 90,
  },
  movie: {
    height: 80,
    width: 250,
    marginVertical: 5,
    marginHorizontal: 5,
    flexWrap: 'wrap'
  },
});
