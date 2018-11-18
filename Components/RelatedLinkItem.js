import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button, Linking} from 'react-native';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import HTMLView from 'react-native-htmlview';

//const util = require('util');
class RelatedLinkItem extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        link: this.props.link,
                        linkTitle: this.props.linkTitle,
                        type: this.props.type
                        }
    }
    componentDidMount(){
        this.chooseScreen = this.chooseScreen.bind(this);
        return  this.render();
    }
    render(){
        var chooseFunction = () => this.chooseScreen(this.state.link);
        var typeImage;
        if(this.state.type == "nhs"){
            //console.log("use nhs type for relate link");
            typeImage = (<Image
                source={require('../assets/images/nhs_link.png')}
                style={styles.relatedItemImage}
            />)
        }
        else if(this.state.type == "tommy's"){
            //console.log("use tommy type for relate link");
            typeImage = (<Image
                source={require('../assets/images/tommys_link.png')}
                style={styles.relatedItemImage}
            />)
        }
        else if(this.state.type == "nice"){
            //console.log("use tommy type for relate link");
            typeImage = (<Image
                source={require('../assets/images/nice_link.png')}
                style={styles.relatedItemImage}
            />)
        }
        else if(this.state.type == "rcog"){
            //console.log("use tommy type for relate link");
            typeImage = (<Image
                source={require('../assets/images/rcog_link.png')}
                style={styles.relatedItemImage}
            />)
        }
        else if(this.state.type == "nct"){
            //console.log("use tommy type for relate link");
            typeImage = (<Image
                source={require('../assets/images/nct_link.png')}
                style={styles.relatedItemImage}
            />)
        }
        else{
            console.log("use deault type for relate link");
            typeImage = (<Image
                source={require('../assets/images/www_link.png')}
                style={styles.relatedItemImage}
            />)
        }
        return (
            <TouchableOpacity onPress={chooseFunction}>
						<View style={styles.relatedbutton}>
                            <View style={styles.relatedImageContainer}>
                                {typeImage}
                            </View>
                            <View style={styles.relatedTextContainer}>

                                
                                <HTMLView addLineBreaks={false} 
                                     value={"<p>"+this.state.linkTitle+"</p>"}
                                     stylesheet={styles}
                                     ></HTMLView>
                            </View>
                            <View style={styles.relatedArrowContainer}>
                                <Image
                                    source={require('../assets/images/arrow.png')}
                                    style={styles.relatedArrowImage}
                                />
                            </View>
						</View>
		        </TouchableOpacity>
        );
    }
    chooseScreen (){
        
        var Analytics = require('../Data/Analytics').default;
        Analytics.hitEvent('Weblink','related_link',this.state.link);
        Linking.openURL(this.state.link);

    }
}

const styles = StyleSheet.create({
    relatedbutton: {
        backgroundColor:'#ECFAF7',
        flexGrow:1,
        flexDirection: 'row',
        height:80,
        width:null,
        alignItems: 'center',
        borderBottomColor: '#FFFFFF',
        borderBottomWidth: 1,
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
    p: {
        color: '#808080',
        fontSize: 14,
        fontFamily: 'Lato-Regular',
        textAlign: 'left',
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
export default withNavigation(RelatedLinkItem);