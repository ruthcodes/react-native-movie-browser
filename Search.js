import React from 'react';
import { StyleSheet, View, TextInput, Text, FlatList, Image, ScrollView, TouchableOpacity, Button, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import { Constants } from 'expo'
import { API_KEY } from './config.js'

export default class Search extends React.Component {

  state = {
    search: '',
    apiRes: '',
    totalResponses: 0,
    pageCounter: 0,
  }

  handleSearchInput = search => {
    this.setState({search})
  }

  requestMore = () => {
    let self = this
    let copy = this.state.apiRes
    let count = this.state.pageCounter
    //increment pageCounter
    this.setState({
      pageCounter: this.state.pageCounter + 1,
    })
    //make api call based on pageCounter
    let req = "http://www.omdbapi.com/?apikey=" + API_KEY + "&s=" + encodeURIComponent(this.state.search) + "&page=" + this.state.pageCounter
    let x = new XMLHttpRequest();
    x.onreadystatechange = function() {
      console.log("in ready state")
        if (this.readyState == 4 && this.status == 200) {
          let parsed = JSON.parse(this.responseText)
          console.log("200 status")
          if (parsed.Response === "False"){
            self.setState({
              apiRes: '',
              totalResponses: 0,
              pageCounter: 1,
            })
          } else {
            //map over each result in Search and give it a key
            let totalResponses = parsed.totalResults
            parsed = parsed.Search
            let result = parsed.map(function(obj) {
              let o = Object.assign({}, obj);
              o.key = obj.imdbID
              return o
            })

            let final = copy.concat(result)
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            // usage example:

            var unique = final.filter( onlyUnique ); // returns ['a', 1, 2, '1']
            if (count <= 1){
              self.setState({
                apiRes: result,
                totalResponses: totalResponses,
              })
            } else {
              self.setState({
                apiRes: unique,
                totalResponses: totalResponses,
              })
            }
            console.log(result)

          }
       }
    };
    // while api is not responding with false, request next page of api
    x.open("GET", req , true);
    x.send()
  }

  componentDidUpdate(prevProps, prevState){
    let self = this
    if (prevState.search !== this.state.search){
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
                totalResponses: 0,
                pageCounter: 1,
              })
            } else {
              //map over each result in Search and give it a key
              let totalResponses = parsed.totalResults
              parsed = parsed.Search
              let result = parsed.map(function(obj) {
                let o = Object.assign({}, obj);
                o.key = obj.imdbID
                return o
              })
              console.log(result)
                self.setState({
                  apiRes: result,
                  totalResponses: totalResponses,
                })
            }
         }
      };
      // while api is not responding with false, request next page of api
      xhttp.open("GET", req , true);
      xhttp.send()

      //while length of results in apiRes state is less than totalResponses
      //make another request and concat the results to the end of apiRes

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
              onEndReached={()=> this.requestMore()}
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
  },
  movie: {
    height: 80,
    width: 250,
    marginVertical: 5,
    marginHorizontal: 5,
    flexWrap: 'wrap'
  },
});
