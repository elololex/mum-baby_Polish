import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button} from 'react-native';
//const util = require('util');
import HTMLView from 'react-native-htmlview';
import { WebView } from 'react-native';
import User from "../Data/User";
import CreateContent from '../Components/CreateContent';
import {StackNavigator} from "react-navigation";
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';


export default class DefaultContent extends React.Component {
    /*static navigationOptions = ({navigation}) => {
        
        return {
            title: navigation.getParam('replacementTitle',''),
        };
    };*/
    static navigationOptions =({navigation, screenProps }) => ( {
        title: navigation.getParam('replacementTitle',''),
        headerTitleStyle: {
            fontFamily: 'Lato-Regular',
            textAlign: 'center',
            flexGrow:1,
            alignSelf:'center',
        },
        headerRight: (
            
          <Image
                source={navigation.getParam('replacementTopImage',null)}
                style={{height:50, width:50}}
            />
      ),
    });
    componentDidMount(){
        const {navigation} = this.props;
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        if(this.props.navigation.getParam('findTitle',false) == true){
            this.getTitle(pageSlug, true);
        }
        else{
            this.getTitle(pageSlug, false);
        }
        var Analytics = require('../Data/Analytics').default;
        Analytics.hitPage(pageSlug);
        //this.props.navigation.setParams({replacementTitle: jsonData.title.rendered});
    }
    async getTitle(currentPage, resetTitle) {
        try {
        	console.log("try get title");
			const value = await AsyncStorage.getItem('@'+currentPage+':key');
            const updateDataSource = JSON.parse(value);
            if(resetTitle){
                this.props.navigation.setParams({replacementTitle: updateDataSource[0].title.rendered});
            }
            
            //this.props.navigation.setParams({replacementTopImage: require('../assets/images/beforebirth_topicon.png')});
            console.log("CAT FOUND Test ", updateDataSource[0].categories[0]);
            console.log("CAT FOUND", updateDataSource[0].categories);
            if(updateDataSource[0].categories.indexOf(79)>=0){
                //console.log("CAT FOUND 79");
                this.props.navigation.setParams({replacementTopImage: require('../assets/images/afterbirth_topicon.png')});
            }
            else if(updateDataSource[0].categories.indexOf(67)>=0){
                //console.log("CAT FOUND 67");
                this.props.navigation.setParams({replacementTopImage: require('../assets/images/birth_topicon.png')});
            }
            else if(updateDataSource[0].categories.indexOf(44)>=0){
                //console.log("CAT FOUND 44");
                this.props.navigation.setParams({replacementTopImage: require('../assets/images/beforebirth_topicon.png')});
            }
            else if(updateDataSource[0].categories.indexOf(15)>=0){
                //console.log("CAT FOUND 15");
                this.props.navigation.setParams({replacementTopImage: require('../assets/images/hospital_topicon.png')});
            }
            else if(updateDataSource[0].categories.indexOf(18)>=0){
                //console.log("CAT FOUND 18");
                this.props.navigation.setParams({replacementTopImage: require('../assets/images/forms_topicon.png')});
            }
        } catch (error) {
            console.log("Error retrieving data" + error);
				}
				
    }
    render() {
        const {navigation} = this.props;
        const pageSlug = navigation.getParam('slug', 'NO-ID');
        return (
            <View style={{
				flex: 1,
				backgroundColor: 'white'
			  }}>
                <CreateContent slug = {pageSlug}/>
            </View>
        );
    }
    
}
