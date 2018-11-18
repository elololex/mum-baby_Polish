import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button, Linking} from 'react-native';
//const util = require('util');
import { WebView } from 'react-native';
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';

import HTMLView from 'react-native-htmlview';

//const util = require('util');
class RelatedLinkItem extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        attribs: this.props.attribs,
                        videotitle: this.props.videotitle,
                        }
    }
    componentDidMount(){
        
    }
    render(){
        const dimensions = Dimensions.get('window');
			var videoHeight = Math.round((dimensions.width-40) * (9 / 16));
			var videoWidth = dimensions.width-40;
			//const iframeHtml = `<iframe src="${a.src}" scrolling="no" style="width:100%;height:100%;"></iframe>`;
			
        return (
            <View style={styles.videoContainer}>
					<Text style={styles.videoTopTitle}>VIDEO</Text>
                    <HTMLView addLineBreaks={false} 
                                     value={"<p>"+this.state.videotitle+"</p>"}
                                     stylesheet={styles}
                                     ></HTMLView>
					<View style={{flex:1, width: Number(videoWidth), height: Number(videoHeight)}}>
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
					</View>
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

export default withNavigation(RelatedLinkItem);