import React from 'react';
import {Text, View, AsyncStorage} from 'react-native';
import { Container,Content, Header, Left, Body, Right, Icon, Title ,Button, List, ListItem, Item} from 'native-base';
import {StackNavigator} from "react-navigation";
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import User from "../Data/User";
import CreateContent from "../Components/CreateContent";
import DefaultContent from './DefaultContentScreen';
import FormScreen from './FormScreen';
var stringSimilarity = require('string-similarity');
//const util = require('util');
const mainColor =  '#f98267';

class SearchResultsScreen extends React.Component {
	
    static navigationOptions =({navigation, screenProps }) => ( {
        title: 'Search Results',
        headerTitleStyle: {
            fontFamily: 'Lato-Regular',
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
        },
        headerLeft: (
            <Button transparent
            onPress={() => navigation.openDrawer()}>
              <Icon ios='ios-menu' android="md-menu" style={{fontSize: 30, color: 'white'}}/>
            </Button>
        )
        
    });
    constructor(props) {
        super(props);
        this.state = {
            searchEntry : '',
            searchResults : []

        };    
        const {navigation} = props;
        const word = navigation.state;

        // console.log('WORD -> ',word);
      }
    componentDidMount(){
		this._generateSearch();
    }
    
    _generateSearch = async()=>{
        try{
            const word = await AsyncStorage.getItem('@SEARCH_WORD');
            const searchKeys = await AsyncStorage.getItem('@SEARCH_KEYS');
            var matches = []
            var titles = JSON.parse(searchKeys).map( async (key,index) => {
                var element = await AsyncStorage.getItem(key).then(data=>{
                    var obj = JSON.parse(data)[0];

                    // let score = leven(word, obj.title.rendered);
                    // var content = obj.content.rendered
                    var content = obj.content.rendered
                    var found = content.search(word)
                    // var score = stringSimilarity.compareTwoStrings(word, content);
                    // var score = stringSimilarity.compareTwoStrings(word, obj.title.rendered);

                    // console.log('word --> '+key +' ',obj.title.rendered);
                    if(index==0){
                        console.log(obj)
                    }
                    if(obj){
                        console.log(found);
                        matches.push(obj);
                    }
                }).catch(err=>{
                    console.log(err)
                });
                });
            await Promise.all(titles).then(()=>{
                // console.log(matches);
                this.setState({searchResults:matches});

            });


        }catch(err){
            console.log(err);
        }
    }
    
    render(){
        const word =this.props.navigation
        // console.log('-search-',word);
        return(
            <View style={{
				flex: 1,
				backgroundColor: 'white'
			  }}>
                {/* <CreateContent  slug = {"personal-care-welcome-page"}/>     */}
                {/* <CreateContent  slug = {""}/>     */}
                <List dataArray={this.state.searchResults}
                    
                    renderRow={(item) =>
                      <ListItem button onPress={()=>{
                        this.props.navigation.navigate('DefaultContent',{slug:item.slug, replacementTitle:item.title.rendered})
                      }} style={{minHeight:100,borderColor:mainColor,marginRight:20}}>
                      
                        <Left style={{
                          flex:2, 
                          flexDirection:'column'
                          }}>
                        <Text style={{fontSize:16,paddingBottom: 10}}>{item.title.rendered}</Text>  
                        </Left>
                        <Right style={{
                          flex:1
                          }}>

                        </Right>
                      </ListItem>
                    }>
                  </List>
            </View>
        );

    }
    
    

}
export default createStackNavigator({
    Main:{screen:SearchResultsScreen},
    DefaultContent:{screen:DefaultContent},
},
{
    headerMode: 'float',
  /* The header config from HomeScreen is now here */
  navigationOptions: ({navigation, screenProps }) => ({
    headerStyle: {
      backgroundColor: '#FA7E5B',
    },
    headerBackTitle: null,
    headerTintColor: '#fff',
    headerMode: 'screen',
    headerTitleStyle: {
        fontFamily: 'Lato-Regular',
    }
  })
});

