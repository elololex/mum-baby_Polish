import React, {Component} from 'react';
import { StyleSheet, Text, View ,SafeAreaView, ScrollView, Image,FlatList,TouchableOpacity,AsyncStorage} from 'react-native';
import {createStackNavigator,createDrawerNavigator,createSwitchNavigator , DrawerItems,NavigationActions} from 'react-navigation';
import {Header, Item, Icon, Input, InputGroup,List, ListItem,Left,Right,Button} from 'native-base'
const mainColor =  '#f98267';


export default class HeaderMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
        searchEntry :'',
        clearCount: 0
    };

    this.searchBox = null;
    //this._textInput = null;
  }

  _processSearch = ()=>{

  }
  clearText (){
    console.log('try clear text function')
    
    if (this.input != null) {
      this.input._root.clear();
      //this._textInput.clear();
    }
    else{
      console.log('text input null')
    }
  
  }
  render() {
    const { items, ...rest } = this.props;
    const ignoreList = ['SearchScreen','Home']
    const filteredItems = items.filter(item => ignoreList.indexOf(item.key)===-1);
    
    return (
        <View style={{flex:1}}>
        <View style={{height:150,  backgroundColor:'#f98267', alignItems:'center',
          justifyContent:'center',}} searchBar rounded>


        <View style={{flex:1,alignItems:'center', justifyContent:'flex-end'}}>
        <TouchableOpacity onPress={()=>{
                this.props.navigation.toggleDrawer();
                this.props.navigation.navigate('Home');
              }}>
        <Image
                  source={require('../assets/images/menu_logo.png')}
                  style={styles.logoImage}
              />
                      </TouchableOpacity>

        </View>
        <View style={{flex:1}}>
        <InputGroup rounded style={{backgroundColor:'rgba(255, 255, 255, 0.4)',width:200, height:30,margin:20, borderColor:'rgba(255, 255, 255, 0)'}}>
              <Icon name='search' style={{color:'#fff',fontSize:14}}/>
              <Input 
              key ={'input'+this.state.clearCount}
              onChangeText={(val)=>{
                    this.setState({searchEntry:val})
                }}   
                returnKeyType='search'   
            onSubmitEditing={async()=>{
                // const navigateAction = NavigationActions.navigate({
                //     routeName: 'SearchScreen',
                  
                //     params: {word:this.state},
                //     action :NavigationActions.navigate({ routeName: 'Home', params: {word:this.state}})
                //   });
                try{
                  let rand = Math.random () * 10000;
                  console.log(rand)
                  this.props.navigation.toggleDrawer();
                  if(this.state.searchEntry){
                    // this.props.navigation.setParams({ seactItem: 'Lucy' })
                    await AsyncStorage.setItem('@SEARCH_WORD',this.state.searchEntry);

                    this.props.navigation.navigate('SearchBrokerScreen');

                  }
                }catch(err){

                }

                
            }}
            placeholder='Search...' 
            placeholderTextColor="#fff" 
            style={{color:'#fff',
            fontSize: 14} }/>
              <TouchableOpacity onPress={()=>{
                //console.log('delete search string');
                //this.clearText()
                const newValue = this.state.clearCount +1;
                this.setState({clearCount:newValue});
              }}>
              <Icon name='close-circle' style={{color:'#fff',fontSize:14}}/>
              </TouchableOpacity>
            </InputGroup>
        </View>
          </View>
        <ScrollView>
        <DrawerItems items={filteredItems} {...rest}
        getLabel = {(scene) => (
      <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems:'center', paddingLeft:20}}>
        {/* <Icon style={{color:mainColor}}  name='bicycle'/> */}
        <Text style={{ color:mainColor, fontSize:14} }>{this.props.getLabel(scene)}</Text>
      </View>
    )}/>
        </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create(
    {
      logoImage: {
        height:33,
        width:162,
      },
    });

    // <DrawerItems {...this.props.items}
    // getLabel = {(scene) => (
    //   <View style={{height:40,flexDirection:'row',justifyContent:'center',alignItems:'center', paddingLeft:20}}>
    //     {/* <Icon style={{color:mainColor}}  name='bicycle'/> */}
    //     <Text style={{ color:mainColor, fontSize:14} }>{props.getLabel(scene)}</Text>
    //   </View>
    // )}