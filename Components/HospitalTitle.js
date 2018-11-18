import React from 'react';
import {AsyncStorage,TouchableOpacity, Text, View, Image,FlatList,StyleSheet,ScrollView, Dimensions, Button, Linking} from 'react-native';
//const util = require('util');
import {createStackNavigator,withNavigation, DrawerActions} from 'react-navigation';
import HTMLView from 'react-native-htmlview';
//const util = require('util');
export default class HospitalTitle extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={   isLoading: true,
                        pageSlug: this.props.pageSlug,
                        hospitalTitle:""
                        }
    }

    componentDidMount(){
        //this.getTitle()
       return  this.render();
    }
    /*async getTitle() {
        try {
        	console.log("try get title");
			const value = await AsyncStorage.getItem('@'+this.state.pageSlug+':key');
            const updateDataSource = JSON.parse(value);
            this.setState({hospitalTitle: updateDataSource[0].title.rendered});
            this.forceUpdate();
        } catch (error) {
            console.log("Error retrieving data" + error);
				}
				
    }*/
    
    render(){
        const state = this.state;
        const chooseFunction = () => this.chooseScreen();	
        return (
           <HTMLView  	
					 					addLineBreaks={false} 
									 value={"<h2>"+global.myhospitalTitle+"</h2>"}
    								stylesheet={htmlStyles}
                  />
        );
    }
    
}


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
		fontFamily: 'Lato-Regular',
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
		fontFamily: 'Lato-Bold',
		fontSize: 18,
		textAlign: 'left',
		color: '#644D45',
		paddingTop:5,
		paddingBottom:10,
	},
	
	p: {
        fontFamily: 'Lato-Light',
				fontSize: 5,
		},
		
    a: {
        color: '#2CC4A7', // pink links
        fontFamily: 'Lato-Light',
    },
    ol:{
        color: '#FA7E5B',
        fontFamily: 'Lato-Regular',

    },
    b:{
			fontFamily: 'Lato-Bold',
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
    