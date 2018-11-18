import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button, Linking, Platform,ActivityIndicator,NetInfo} from 'react-native';
//const util = require('util');
//import { WebView } from 'react-native';
import WebView from 'react-native-android-fullscreen-webview-video';
import {createStackNavigator,withNavigation, DrawerAction, withNavigationFocus, NavigationEvents} from 'react-navigation';

import HTMLView from 'react-native-htmlview';

//const util = require('util');
class RelatedLinkItem extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        attribs: this.props.attribs,
                        videotitle: this.props.videotitle,
                        isFocused: true,
                        connectionType: "loading",
                        }
    }
    componentDidMount(){
        this.setState({connectionType:this.getConnectionInfo()});
    }
    async updateFocus(focus){
        if(focus != this.state.isFocused){
        this.setState({isFocused:focus});
        }
    }
    async getConnectionInfo () {
        
        if (Platform.OS === 'ios') {
          return new Promise((resolve, reject) => {
            const connectionHandler = connectionInfo => {
              NetInfo.removeEventListener('connectionChange', connectionHandler)
                console.log("net connection: "+connectionInfo.type);
                this.setState({connectionType : connectionInfo.type});
                //this.isFirstLoad();
                resolve(connectionInfo)
            }
      
            NetInfo.addEventListener('connectionChange', connectionHandler)
          })
        }
        else{
            const connection = await NetInfo.getConnectionInfo()

            //if(connection.type =='wifi'||connection.type =='cellular'){
            //this.state.connectionType = connection.type;
            this.setState({connectionType : connection.type});
            console.log("net connection: "+connection.type);
            
            //}
        }
        return true;
      }
    render(){
        const dimensions = Dimensions.get('window');
			var videoHeight = Math.round((dimensions.width-40) * (9 / 16));
			var videoWidth = dimensions.width-40;
			//const iframeHtml = `<iframe src="${a.src}" scrolling="no" style="width:100%;height:100%;"></iframe>`;
		let web = (<View style={{flex:1, width: Number(videoWidth), height: Number(videoHeight)}}>
                    
        <WebView
            source={{
                uri: this.state.attribs.src,
            }}
            onNavigationStateChange={this.onNavigationStateChange}
            startInLoadingState
            scalesPageToFit
            javaScriptEnabled
            style={{ flex: 1 }}
        />
</View>);	
        if(!this.state.isFocused){
            console.log("video no longer in focus");
            web = (<View style={{flex:1, width: Number(videoWidth), height: Number(videoHeight)}}>
                </View>);
        }
        else{
            console.log("video in focus");
            
        }
        let videoWeb =({web});
        if(this.state.connectionType == 'wifi' || this.state.connectionType == 'cellular')
        {
            videoWeb =(<View>{web}</View>);
        }
        else{
            videoWeb =(
                <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#444', width: Number(videoWidth), height: Number(videoHeight)}}>
                        <Text style={styles.videoErrorMessage}>Video content requires an internet connection</Text>
                </View>
            );
        }
        return (
            <View style={styles.videoContainer}>
					<Text style={styles.videoTopTitle}>VIDEO</Text>
                    <HTMLView addLineBreaks={false} 
                                     value={"<p>"+this.state.videotitle+"</p>"}
                                     stylesheet={styles}
                                     ></HTMLView>
                                     <NavigationEvents
                                        onWillFocus={payload => this.updateFocus(true)}
                                        onDidFocus={payload => console.log('did blur')}
                                        onWillBlur={payload => this.updateFocus(false)}
                                        onDidBlur={payload => console.log('did blur')}
                                    />
					{videoWeb}
				</View>
        );
    }
}

const styles = StyleSheet.create({
    videoContainer: {
        paddingTop: 10,
        paddingBottom: 10,
      },
    videoTopTitle:{
        color: '#FA7E5B',
        fontSize: 14,
        paddingBottom: 4,
        fontFamily: 'Lato-Semibold',
    },
    videoTitle:{
        fontSize: 18,
        paddingBottom: 10,
        fontFamily: 'Lato-Light',
    },
    videoErrorMessage:{
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Lato-Semibold',
        textAlign: 'center',
    },
    p:{
        fontSize: 18,
        paddingBottom: 10,
        fontFamily: 'Lato-Light',
    },
    relatedImageContainer:{
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
    },
    relatedItemImage: {
        height:36,
        width:36,
      },
    relatedTextContainer:{
        flex:4,
    },
    relatedbuttonText: {
        color: '#808080',
        fontSize: 14,
        fontFamily: 'Lato-Regular',
        textAlign: 'left',
      },
    relatedArrowContainer:{
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
    },
    relatedArrowImage: {
        height:14,
        width:8,
      },
    });

export default withNavigationFocus(RelatedLinkItem);