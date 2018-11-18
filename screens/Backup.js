import React from '../../Library/Caches/typescript/2.9/node_modules/@types/react';

import User from "../Data/User";
import CreateContent from "../Components/CreateContent";
//const util = require('util');

export default class MaternityUnitsScreen extends React.Component {
	
    static navigationOptions =({navigation, screenProps }) => ( {
    	title: 'Maternity units',
    });
    componentDidMount(){
    	var user:User = require('../Data/User').default;
		
    }
    
    
    render(){
        var {navigate} =  this.props.navigation;
        return(
            <CreateContent/>
        );

    }
    
    

}

