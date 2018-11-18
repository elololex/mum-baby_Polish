import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
//const util = require('util');

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import HTMLView from 'react-native-htmlview';
import { WebView } from 'react-native';
import { AppRegistry, TextInput } from 'react-native';
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import User from "../Data/User";
import SubMenuItem from '../Components/SubMenuItem';
import GoToLink from './GoToLink';
import RelatedLinks from './RelatedLinks';
import { Video } from 'expo';
import VideoPlayer from './VideoPlayer';
import MainMenuButton from './MainMenuButton';
import MainIntro from './MainIntro';
import { Item, CheckBox, Content, ListItem, Body, Left, Right, Radio, Footer, FooterTab, Button } from 'native-base';
import Checkboxes from './Checkboxes';
import QuestionGenerator from './QuestionGenerator';
import BulletPoints from './BulletPoints';
import ImageLoader from './ImageLoader';
//const util = require('util');
import Carousel, { Pagination } from 'react-native-snap-carousel';
export default class WelcomeCarousel extends React.Component {
    constructor(props){
        super(props);
        //this.getMyHospital();
        this.state ={   entries: this.props.entries,
        activeSlide:0,
                        
                        }
    }
    componentDidMount(){
        
    }
    _renderItem ({item, index}) {
        const dimensions = Dimensions.get('window');
					var imageHeight = Math.round((dimensions.width) * 274 / 346);
					var imageWidth = dimensions.width;
        if(index == 0){
            return <ScrollView style={{flex: 1, backgroundColor: '#FFFFFF'}}> 
            <Image
										source={require('../assets/images/logo_and_text.png')}
										style={{width:imageWidth, height:imageHeight, marginTop:20, backgroundColor:"#fcb"}}
							/>
                            <View style={{paddingTop:20, paddingLeft: 20, paddingRight: 20, paddingBottom:10}}>
                                { item.content }
                                </View>
                                </ScrollView>
           
           
        }
        else if(index == 1){
            
            
            return <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
            <Image
										source={require('../assets/images/welcome_maternity.jpg')}
										style={{width:imageWidth, height:imageHeight, marginTop:20, backgroundColor:"#fcb"}}
							/>
            <View style={{backgroundColor: '#FFFFFF'}}> 
            <View style={{paddingTop:20, paddingLeft: 20, paddingRight: 20, paddingBottom:10}}>
                                { item.content }
                                </View>
                                </View>
            </ScrollView>
        }
        else if(index == 2){
            return <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
            
            <Image
										source={require('../assets/images/welcome_advice.jpg')}
										style={{width:imageWidth, height:imageHeight, marginTop:20, backgroundColor:"#fcb"}}
							/>
            <View style={{backgroundColor: '#FFFFFF'}}> 
            <View style={{paddingTop:20, paddingLeft: 20, paddingRight: 20, paddingBottom:10}}>
                                { item.content }
                                </View>
                                </View>
            </ScrollView>
        }
        else if(index == 3){
            return <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
            
            <View style={{backgroundColor: '#FFFFFF'}}> 
            <View style={{paddingTop:20, paddingLeft: 20, paddingRight: 20, paddingBottom:10}}>
                                { item.content }
                                </View>
                                </View>
            </ScrollView>
        }
        else if(index == 4){
            return <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
           
            <View style={{backgroundColor: '#FFFFFF'}}> 
            <View style={{paddingTop:20, paddingLeft: 20, paddingRight: 20, paddingBottom:10}}>
                                { item.content }
                                </View>
                                </View>
            </ScrollView>
        }
        else{
            return <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
           
            <View style={{backgroundColor: '#FFFFFF'}}> 
            <View style={{paddingTop:20, paddingLeft: 20, paddingRight: 20, paddingBottom:10}}>
                                { item.content }
                                </View>
                                </View>
            </ScrollView>
        }
        /*return <ScrollView style={{flex:1, backgroundColor: "#fff"}}>
           
            <View style={{backgroundColor: '#FFFFFF',paddingTop:20, paddingLeft: 20, paddingRight: 20, paddingBottom:10}}> 
                                { item.content }
                                </View>
            </ScrollView>*/
    }

    get pagination () {
        const { entries, activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={entries.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: '#fff' }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                  backgroundColor: '#FA7E5B'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }

    render () {
        const dimensions = Dimensions.get('window');
		var imageWidth = dimensions.width;
        return (
            <View style = {{flexGrow:1}}>
                <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.state.entries}
                renderItem={this._renderItem}
                sliderWidth={imageWidth}
                itemWidth={imageWidth}
                onSnapToItem={(index) => this.setState({ activeSlide: index }) }
            />
            { this.pagination }
            </View>
        );
    }
}