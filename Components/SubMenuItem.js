import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Animated} from 'react-native';
import { Container,Content, Header, Left, Body, Right, Icon, Title ,Button, List, ListItem, Item, Thumbnail} from 'native-base';

import HTMLView from 'react-native-htmlview';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import { FileSystem } from "expo";
import SHA1 from "crypto-js/sha1";
const Entities = require('html-entities').XmlEntities;
import {Answers} from '../assets/json/ImageDir'
//const util = require('util');


class SubMenuItem extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        uri: undefined,
                        tableData: [],
                        slug: this.props.slug,
                        htmlTitle: this.props.htmlTitle,
                        parentTitle:this.props.parentTitle,
                        hospitalpage:this.props.hospitalpage,
                        fromURL:true,
                        fadeAnim: new Animated.Value(1),  // Initial value for opacity: 0
                        }
        this.getContent(this.state.slug);
    }
    
    componentDidMount(){
        this.chooseScreen = this.chooseScreen.bind(this);
        
		return  this.render();
    }
    
    
    async getContent(currentPage) {
        try {
        	//console.log("try get key" + this.state.slug);
                        const value = await AsyncStorage.getItem('@'+currentPage+':key');
                        //const ext = uri.substring(uri.lastIndexOf("."), uri.indexOf("?") === -1 ? undefined : uri.indexOf("?"));
                        const jsonHTML = JSON.parse(value)
                        let uri;
                        let path;
                        let fromURL = true;
                        if(jsonHTML[0].better_featured_image !== null){
                            uri = jsonHTML[0].better_featured_image.media_details.sizes.thumbnail.source_url;
                            const ext = uri.substring(uri.lastIndexOf("."), uri.indexOf("?") === -1 ? undefined : uri.indexOf("?"));
                            path = FileSystem.documentDirectory + SHA1(uri) + ext;
                            const info = await FileSystem.getInfoAsync(path);
                            const fileName = uri.substring(uri.lastIndexOf('/')+1,uri.length);
                            //const fileName = 'test.jpg';
                            //console.log('Answers[fileName]:',Answers[fileName]);
                            if (!info.exists || true) {
                                if(Answers[fileName]>=0 && Answers[fileName]!=undefined){
                                    console.log("loading thumb IMAGEE FROM local")
                                    path = Answers[fileName];
                                    fromURL = false;
                                }
                                else{
                                    await FileSystem.downloadAsync(uri, path);
                                }
                                
                            
                            }
                            //console.log("exists"+info.exists+" path: "+path);
                        }
                        
                        
                          this.setState({txt: value, dataSource: jsonHTML, uri: path, isLoading:false, fromURL:fromURL});
                        const {setParams} = this.props.navigation;
                        setParams({ title: 'titleText' })
                        /*Animated.timing(                  // Animate over time
                            this.state.fadeAnim,            // The animated value to drive
                            {
                            toValue: 1,                   // Animate to opacity: 1 (opaque)
                            duration: 500,              // Make it take a while
                            }
                        ).start();                        // Starts the animation*/
        } catch (error) {
            console.log("Error retrieving data" + error);
				}
				
    }
    render(){
        const state = this.state;
        var imageURL = undefined;
        if(this.state.dataSource !== undefined)
        {
            let fadeAnim = this.state.fadeAnim;
            const item = this.state.dataSource;
            //console.log("this.state.dataSource:");
            //console.log("log item: " + this.state.dataSource[0]);
            if(item !== null){
                if(item[0].better_featured_image !== null){
                    //console.log("uri for thumb:" + this.state.uri);
                    imageURL = this.state.uri;
                }
            }
            const chooseFunction = () => this.chooseScreen();	
            if(this.state.fromURL){
            return (
                
            <View>
                        
                        <TouchableOpacity onPress={chooseFunction}>
                            <View style={styles.subitem}>
                                <View style={{margin:10,flex:2}}>
                                
                                <HTMLView addLineBreaks={false} 
                                        value={"<p>"+this.state.htmlTitle+"</p>"}
                                        stylesheet={styles}
                                        renderNode={this.renderNode}
                                        ></HTMLView>
                                
                                
                                </View>
                                <View style={{margin:10, height:100,width:160, backgroundColor: 'white'}}>
                                <Thumbnail key={this.props.slug}
                                    style={{height:100, width:160}}
                                    source={{uri:imageURL}}
                                />
                                </View>
                            </View>
                        </TouchableOpacity>
            </View>
            );
            }
            else{
                return (
                    <View>
                        
                            <TouchableOpacity onPress={chooseFunction}>
                                <View style={styles.subitem}>
                                    <View style={{margin:10,flex:2}}>
                                    
                                    <HTMLView addLineBreaks={false} 
                                            value={"<p>"+this.state.htmlTitle+"</p>"}
                                            stylesheet={styles}
                                            renderNode={this.renderNode}
                                            ></HTMLView>
                                    
                                    
                                    </View>
                                    <View style={{margin:10, height:100,width:160, backgroundColor: 'white'}}>
                                    <Thumbnail square key={this.props.slug}
                                        style={{height:100, width:160}}
                                        source={imageURL}
                                    />
                                    </View>
                                </View>
                            </TouchableOpacity>
                </View>
                );
            }
        }
        else{
            return(
                <View style={styles.subitem}>

                </View>
            )
        }
        
        
    }
    renderNode(node, index, siblings, parent, defaultRenderer) {
        //var tempIndex:int = this.getNewIndex();
        //console.log("what is the index:", index);
        //console.log("what is the tempindex:", this.newIndex);
          if(node.name == 'p'){
              return(
                <Text key = {index} 
                            //adjustsFontSizeToFit
                            numberOfLines={4}
                            minimumFontScale={0.90} 
                            style={styles.subitemText}>
                            {defaultRenderer(node.children, node)}
                            </Text>
              );
          }
        }
    chooseScreen (){
        console.log("Screen to:" + this.state.slug);
        const {push} =  this.props.navigation;
        const entities = new Entities();
        const parentScreenTitle = entities.decode(this.state.parentTitle);
        if(this.state.hospitalpage == true){
            push("HospitalPage", {replacementTitle: parentScreenTitle , slug:this.state.slug})
        }
        else{
            push("DefaultContent", {replacementTitle: parentScreenTitle , slug:this.state.slug})
        }
    }
}

const styles = StyleSheet.create({
    relatedLinksBar: {
        backgroundColor:'#2CC4AA',
        flexGrow:1,
        height:null,
        width:null,
        alignItems: 'center',
        justifyContent:'center',
      },
      subitem: {
        backgroundColor:'#ffffff',
        flex: 1, 
        flexDirection: 'row',
        height:120,
        width:null,
       borderBottomColor: '#FA7E5B',
        borderBottomWidth: 1,
      },
      subitemText: {
        color: '#000',
        fontSize: 15,
        fontFamily: 'Lato-Regular',
        textAlign: 'left',
      },
      relatedbutton: {
        backgroundColor:'#ECFAF7',
        flexGrow:1,
        height:80,
        width:null,
        alignItems: 'center',
        justifyContent:'center',
      },
      relatedbuttonText: {
        color: '#808080',
        fontSize: 18,
        fontFamily: 'Lato-Regular',
        height:30,
        textAlign: 'left',
      },
      internalLink: {
        backgroundColor:'#FA7E5B',
        flexGrow:1,
        height:null,
        width:null,
        alignItems: 'center',
        justifyContent:'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Lato-Regular',
        height:30,
        textAlign: 'left',
      },
    });
    
    const styles2 = StyleSheet.create({
        default: {
            color: '#FA7E5B',
            fontFamily: 'Merriweather-Regular',
            fontSize: 14,
        },
        h1: {
            fontFamily: 'Merriweather-Regular',
            fontSize: 24,
            textAlign: 'left',
            color: '#000000',
        },
        h2: {
            fontFamily: 'Lato-Light',
            fontSize: 18,
            textAlign: 'left',
            color: '#644D45',
        },
        
        p: {
            fontFamily: 'Lato-Light',
            fontSize: 14,
        },
        a: {
            color: '#2CC4A7', // pink links
            fontFamily: 'Lato-Light',
        },
        ol:{
            color: '#FA7E5B',
            fontFamily: 'Lato-Regular',
    
        },
        
        ul: {
            color: '#FA7E5B',
            fontFamily: 'Lato-Light',
        },
        li: {
            color: '#000000',
            fontFamily: 'Lato-Light',
        },
        span: {
            color: '#000000',
            fontFamily: 'Lato-Light',
        },
    })
export default withNavigation(SubMenuItem);