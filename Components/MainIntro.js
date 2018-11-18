import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button, Linking} from 'react-native';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import HospitalTitle from './HospitalTitle';
//const util = require('util');
class MainIntro extends React.Component {
    
    constructor(props){
        super(props);
        //this.getMyHospital();
        this.state ={   isLoading: true,
                        linkNode: this.props.linkNode,
                        hospitalSelected:this.props.hospitalSelected,
                        nohospital:this.props.nohospital,
                        pageSlug: this.props.pageSlug,
                        hospitalContent:(<View></View>)
                        }
    }
    
    componentDidMount(){
        this.chooseScreen = this.chooseScreen.bind(this);
        
       return  this.render();
    }
    /*getMyHospital() {
        try {
        	//console.log("try get title: " + currentPage);
			//const value = await AsyncStorage.getItem('@MyHospital:key');
            const pageSlug = value;
            
            
            this.setState({hospitalSelected: pageSlug, hospitalContent: hospitalContent});
            this.forceUpdate();
        } catch (error) {
            console.log("Error retrieving data" + error);
				}
				
    }*/
    
    render(){
        const state = this.state;
        const chooseFunction = () => this.chooseScreen();	
        
        let hospitalContent;
            if(global.myhospitalSlug !== null){
                hospitalContent = (<View><HospitalTitle/>{this.state.hospitalSelected}</View>); 
            }
            else{
                hospitalContent = this.state.nohospital;
            }
        return (
            
                <View style={styles.mainContainer}>
                    {hospitalContent}
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
                navigate(this.state.linkNode.attribs['data-pagetype'], {replacementTitle: "Maternity contacts" , slug:pageName})
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


    const styles = StyleSheet.create(
        {
           mainContainer:{
            flex: 1,
           },
           topView:{
            height: 70,
            flex:1, 
           },
            bottomView:{
         
              width: '100%', 
              height: 70, 
              backgroundColor: '#808080', 
              justifyContent: 'center', 
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
              flex:1, 
            },
         
            textStyle:{
            fontFamily: 'Lato-Regular',
              color: '#fff',
              fontSize:16
            }
        });
export default withNavigation(MainIntro);