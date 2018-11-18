import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Linking} from 'react-native';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import { Button } from 'native-base';
//const util = require('util');
import HTMLView from 'react-native-htmlview';
const Entities = require('html-entities').XmlEntities;
class GoToLink extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        linkNode: this.props.linkNode,
                        butColorSet:false,
                        butColor:'#FA7E5B',
                        }
    }

    componentDidMount(){
        this.chooseScreen = this.chooseScreen.bind(this);
       return  this.render();
    }
    
    
    render(){
        const state = this.state;
        
        let buttonText = this.state.linkNode.children[0].data;
        let butColor = '#FA7E5B';
        if(this.state.linkNode.attribs['color'] !== undefined){
            butColor = this.state.linkNode.attribs['color'];
            this.state.butColor = this.state.linkNode.attribs['color'];
            this.state.butColorSet = true;
            
        }
        if(this.state.linkNode.attribs['internal'] == "true"){
            var splitArray = this.state.linkNode.attribs.href.split("/")
            var pageName = splitArray[splitArray.length-2];
            if(pageName == "maternity-units"){
                if(global.myhospitalSlug !== null){
                    buttonText = "Contact my maternity unit";
                }
                else{
                    buttonText = "Explore maternity units";
                }
            }
        }
        const chooseFunction = () => this.chooseScreen();
        const entities = new Entities();
        buttonText = entities.decode(buttonText);
        if(this.state.linkNode.attribs['internal'] === undefined){
            butColor = '#2CC4AA';
        }
        return (
            <Button onPress={() => this.chooseScreen(this.state.linkNode.attribs.href)} 
            style={{
                marginTop:10,
                marginBottom:10,
                height:45,
            }} transparent
            >
            <View style={{
                backgroundColor:butColor,
                flexGrow:1,
                flexDirection: 'row',
                height:45,
                borderRadius: 5,
                width:null,
                alignItems: 'center',
                }}>
                <View style={styles.textContainer}>
                        
                        <HTMLView addLineBreaks={false} 
                                     value={"<p>"+buttonText+"</p>"}
                                     stylesheet={styles}
                                     ></HTMLView>
                    </View>
                    <View style={styles.relatedArrowContainer}>
                                <Image
                                    source={require('../assets/images/white_arrow.png')}
                                    style={styles.relatedArrowImage}
                                />
                    </View>

                    </View>
            </Button>
            
        );
    }
    chooseScreen (href){
        const entities = new Entities();
        const parentScreenTitle = entities.decode(this.state.linkNode.children[0].data);
        if(this.state.linkNode.attribs['internal'] == "true"){
            var splitArray = href.split("/")
            var pageName = splitArray[splitArray.length-2];
            if(pageName == "maternity-units"){
                let pageType = "MaternityUnits";
                if(global.myhospitalSlug !== null){
                    pageName = global.myhospitalSlug;
                }
                else{
                    pageName = "maternity-units";
                    //pageName = "hospital-maternity-units";
                    //pageType = "MaternityUnits";
                    //navigate(this.state.linkNode.attribs['data-pagetype'], {replacementTitle: this.state.linkNode.children[0].data , slug:pageName})
                }
                const {navigate} =  this.props.navigation;
                navigate(pageType, {headerLeft: null, replacementTitle: parentScreenTitle , slug:pageName})
            }
            else{
                if(this.state.linkNode.attribs['data-pagetype']){
                        const {navigate} =  this.props.navigation;
                            if(this.state.butColorSet){
                                global.themeColor = this.state.butColor;
                                global.useThemeColor = true;
                            }
                            else{
                                global.themeColor = '#2CC4AA';
                            }
                            console.log("don't change background colour")
                            navigate(this.state.linkNode.attribs['data-pagetype'], {header: null, replacementTitle: parentScreenTitle , slug:pageName})
                        
                        
                    }
                else{
                        const {push} =  this.props.navigation;
                        push("DefaultContent", {replacementTitle: parentScreenTitle , slug:pageName})
                    }
            }
            
        }
        else{
            
            var Analytics = require('../Data/Analytics').default;
            Analytics.hitEvent('Weblink','goto_link',this.state.link);
            Linking.openURL(href);
        }
        
    }
}

const styles = StyleSheet.create({
    relatedbutton: {
        backgroundColor:'#FA7E5B',
        flexGrow:1,
        flexDirection: 'row',
        height:40,
        borderRadius: 5,
        width:null,
        alignItems: 'center',
      },
      internalLink: {
        backgroundColor:'#FA7E5B',
        flexGrow:1,
        flexDirection: 'row',
        width:null,
        alignItems: 'center',
        justifyContent:'center',
        height:40,
        marginTop:10,
        marginBottom:10,
      },
      textContainer:{
        flex:5,
        flexDirection:'row',
      },
      buttonText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Lato-Regular',
        paddingLeft: 15,
        flex: 1, 
        flexWrap: 'wrap',
        justifyContent: 'center',
        textAlign: 'left',
      },
      p: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Lato-Regular',
        paddingLeft: 15,
        flexWrap: 'wrap',
        textAlign: 'left',
      },
      relatedArrowContainer:{
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
    },
    relatedArrowImage: {
        height:19,
        width:10,
      },
    }
    );
    
export default withNavigation(GoToLink);