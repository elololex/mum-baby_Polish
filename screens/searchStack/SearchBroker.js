import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class SearchBrookerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount(){
    this.subs = [
      this.props.navigation.addListener('willFocus', () => {
        this.props.navigation.navigate('SearchResultsScreen');
      }),
    ];
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => {
      sub.remove();
    });
    
  }
  render() {
    return (
      <View>
      </View>
    );
  }
}
