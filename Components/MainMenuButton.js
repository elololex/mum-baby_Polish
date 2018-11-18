import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button, Linking} from 'react-native';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions, NavigationActions, StackActions} from 'react-navigation';
//const util = require('util');
class MainMenuButton extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        linkNode: this.props.linkNode
                        }
    }

    componentDidMount(){
        this.chooseScreen = this.chooseScreen.bind(this);
       return  this.render();
    }
    
    
    render(){
        const state = this.state;
        const chooseFunction = () => this.chooseScreen();	
        let imageurl;
        if(this.state.linkNode.attribs['data-iconname'] == "maternity_but"){
            imageurl = require('../assets/images/maternity_but.png');
        }
        else if(this.state.linkNode.attribs['data-iconname'] == "beforebirth_but"){
            imageurl = require('../assets/images/beforebirth_but.png');
        }
        else if(this.state.linkNode.attribs['data-iconname'] == "birth_but"){
            imageurl = require('../assets/images/birth_but.png');
        }
        else if(this.state.linkNode.attribs['data-iconname'] == "afterbirth_but"){
            imageurl = require('../assets/images/afterbirth_but.png');
        }
        else if(this.state.linkNode.attribs['data-iconname'] == "appointments_but"){
            imageurl = require('../assets/images/appointments_but.png');
        }
        else if(this.state.linkNode.attribs['data-iconname'] == "careplan_but"){
            imageurl = require('../assets/images/careplan_but.png');
        }
        return (
            
                <View style={styles.internalLink}>
                    <TouchableOpacity onPress={() => this.chooseScreen(this.state.linkNode.attribs.href)}>
                    <Image
                        source={imageurl}
                        style={styles.buttonImage}
                    />
                    </TouchableOpacity>
                </View>
            
        );
    }
    chooseScreen (href){
        if(this.state.linkNode.attribs['internal'] == "true"){
            var splitArray = href.split("/")
			var pageName = splitArray[splitArray.length-2];
            console.log("Screen to:" + this.state.slug);
            //const {navigate} =  this.props.navigation;
            //navigate("MaternityUnits", {replacementTitle: "Maternity contacts" , slug:pageName})
            if(this.state.linkNode.attribs['data-pagetype']){
                const {navigate} =  this.props.navigation;  
                    //navigate("MaternityUnits", {replacementTitle: '' , findTitle: true,slug:pageSlug})
                navigate(this.state.linkNode.attribs['data-pagetype'], {replacementTitle: "Maternity contacts" , slug:pageName})
                /*const resetAction = NavigationActions.navigate({
                    routeName: 'MaternityUnits',
                    
                    params: {},
                        actions: NavigationActions.navigate({ routeName: 'Main' }),
                    })
    
                
                this.props.navigation.dispatch(resetAction)*/
                
            }
            else{
                const {push} =  this.props.navigation;
                push("DefaultContent", {replacementTitle: "Maternity contacts" , slug:pageName})
            }
        }
        else{
            Linking.openURL(href);
        }
        
    }
}

const styles = StyleSheet.create({
    buttonImage: {
        height:101,
        width:102,
      },
      internalLink: {
        
        width:null,
        alignItems: 'center',
        justifyContent:'center',
        marginTop:10,
        marginLeft:5,
        marginRight:5,
        marginBottom:10,
      },
      textContainer:{
        flex:5,
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Lato-Regular',
        textAlign: 'left',
        paddingLeft: 15
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
    
export default withNavigation(MainMenuButton);