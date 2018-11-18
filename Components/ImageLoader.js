import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button, Animated} from 'react-native';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import RelatedLinkItem from './RelatedLinkItem';
import { Item, CheckBox, Content, ListItem, Body, Left, Right, Radio, Container } from 'native-base';
import { FileSystem } from "expo";
import SHA1 from "crypto-js/sha1";
import {Answers} from '../assets/json/ImageDir'
//const util = require('util');
export default class ImageLoader extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        node: this.props.node,
                        imageURL:"",
                        fromURL:true,
                        fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
                        
                        }
        //this.getImageRef = this.getImageRef.bind(this);
        this.getImageRef();
    }
    componentDidMount(){
        //this.state.checkBoxesUpdate(this.state.answers);
        
    }
    async getImageRef(){
        const node = this.state.node;
        const a = node.attribs;
        const uri = a.src;
        const ext = uri.substring(uri.lastIndexOf("."), uri.indexOf("?") === -1 ? undefined : uri.indexOf("?"));
        let path = FileSystem.documentDirectory + SHA1(uri) + ext;
        const fileName = uri.substring(uri.lastIndexOf('/')+1,uri.length);
        const info = await FileSystem.getInfoAsync(path);
        let fromURL = true;
        if (!info.exists) {
                if(Answers[fileName]>=0 && Answers[fileName]!=undefined){
                    //console.log("loading IMAGEE FROM local")
                    path = Answers[fileName];
                    fromURL = false;
                }
                else{
                    await FileSystem.downloadAsync(uri, path);
                }
                
        }
        this.setState({ imageURL:path , isLoading: false, fromURL:fromURL });
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
              toValue: 1,                   // Animate to opacity: 1 (opaque)
              duration: 500,              // Make it take a while
            }
          ).start();                        // Starts the animation
          
    }
    render(){
        const node = this.state.node;
        const a = node.attribs;
        const dimensions = Dimensions.get('window');
        var rawImageWidth = a.width;
        var rawImageHeight = a.height;
        var imageHeight = Math.round((dimensions.width-40) * rawImageHeight / rawImageWidth);
        var imageWidth = dimensions.width-40;
        const uri = this.state.imageURL;
        let fadeAnim = this.state.fadeAnim;
        let tempSource = null;
       if(this.state.isLoading){
        
       }
       else if(this.state.fromURL){
         tempSource ={uri: uri}
       }
       else {
        tempSource = uri;
       }
       return (
        <View style={{
            backgroundColor:'#fff', width:imageWidth, height:imageHeight+15,paddingBottom:15}}>
        <Image 
                        style={{        // Bind opacity to animated value
                            backgroundColor:'#fff', width:imageWidth, height:imageHeight,paddingBottom:15}}
                        source={tempSource}
                    />
                    </View>
        );
    }
}

const styles = StyleSheet.create({
    relatedLinksContainer: {
        paddingTop:10,
        backgroundColor:'#ffffff',
      },
    relatedLinksBar: {
        backgroundColor:'#2CC4AA',
        flexGrow:1,
        height:40,
        width:null,
        alignItems: 'flex-start',
        justifyContent:'center',
        paddingLeft: 20,
      },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Lato-Bold',
        height:30,
        textAlign: 'left',
      },
      itemText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Lato-Light',
        textAlign: 'left',
        paddingLeft:10,
        paddingBottom:5,
      },
    });

    const htmlStyles = StyleSheet.create({
        bulletContainer:{
            flex: 1, 
            flexDirection: 'row',
            alignItems: 'stretch',
            padding:5,
            paddingBottom: 10
        
            
        },
        subMenu:{
            paddingTop: 0,
            paddingBottom: 20,
            borderTopColor: '#FA7E5B',
        borderTopWidth: 1,
        },
        bulletCircleContainer:{
            flex: 1,
            paddingTop: 15,
            paddingLeft: 10
        },
        
        circle: {
        width: 8,
            height: 8,
        borderRadius: 8/2,
            backgroundColor: '#FA7E5B',
        },
        bulletNumberContainer:{
            flex: 1,
            paddingTop: 5,
            paddingLeft: 10
        },
        numberContainer:{
            color: '#FA7E5B',
            fontFamily: 'Lato-Bold',
        },
        bulletTextContainer:{
            flex: 10,
        },
        bulletText:{
            color: '#000000',
            fontFamily: 'Lato-Light',
            fontSize: 16
        },
        buletTextComponent:{
            color: '#000000',
            fontFamily: 'Lato-Light',
            fontSize: 16,
            lineHeight: 25,
        },
        textComponent:{
            color: '#000000',
            fontFamily: 'Lato-Light',
            fontSize: 16,
            paddingTop: 10,
            paddingBottom: 10,
            lineHeight: 25,
        },
        span: {
            color: '#000000',
            fontFamily: 'Lato-Light',
            fontSize: 16,
            padding:0,
            margin:0,
            paddingTop: 0,
            marginBottom: 15,
            lineHeight: 25,
        },
        img: {
            paddingBottom:15,
            
        },
        h1: {
            fontFamily: 'Merriweather-Regular',
            fontSize: 24,
            textAlign: 'left',
            color: '#000000',
            paddingTop:15,
            paddingBottom:15,
            lineHeight: 30,
        },
        h2: {
            fontFamily: 'Lato-Medium',
            fontSize: 18,
            textAlign: 'left',
            paddingTop: 10,
            color: '#644D45',
            paddingBottom:10,
        },
        h3: {
            fontFamily: 'Lato-Medium',
            fontSize: 16,
            textAlign: 'left',
            color: '#644D45',
            paddingBottom:15,
        },
        i: {
            fontFamily: 'Lato-Italic',
            fontSize: 16,
        },
        p: {
            fontFamily: 'Lato-Light',
                    fontSize: 16,
            },
            
        a: {
            color: '#2CC4A7', // pink links
            fontFamily: 'Lato-Bold',
        },
        ol:{
            color: '#FA7E5B',
            fontFamily: 'Lato-Regular',
    
        },
        b:{
                fontFamily: 'Lato-Semibold',
            },
        ul: {
            color: '#FA7E5B',
            fontFamily: 'Lato-Light',
        },
        li: {
            color: '#000000',
            fontFamily: 'Lato-Light',
        },
        
    })
// withNavigation(Checkboxes);