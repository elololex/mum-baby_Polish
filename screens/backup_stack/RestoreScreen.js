import React, { Component } from 'react';
import { View, Text,AsyncStorage } from 'react-native';
import { Container,Content, Header, Left, Body, Right, Icon, Title ,Button, List, ListItem, Item} from 'native-base';
import {createStackNavigator} from 'react-navigation'

const url = 'https://www.googleapis.com/drive/v3'

export default class RetoreScreen extends Component {
    static navigationOptions = {
      title: 'Restore Backup',
    };

    constructor(props) {
        super(props);
        this.state = {accessToken :''}
      }
  _loadFile = (item)=>{
    this.getBackupFile(item.id)
  }
  configureGetOptions = ()=> {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${this.state.accessToken}`)
    return {
      method: 'GET',
      headers,
    }
  }

  // returns the file meta data only. the id can then be used to download the file
  getBackupFile = (fileId) => {
    const options = this.configureGetOptions()
    return fetch(`${url}/files?q=${fileId}&spaces=appDataFolder`, options)
      .then(this.parseAndHandleErrors)
      .then((body) => {
        // this.setState({allData : body.files})
        console.log(body)
        if (body && body.files && body.files.length > 0) return body.files[0]
        return null
      })
  }
  _getAccessToken = async()=>{
      var r = await AsyncStorage.getItem('@ACCESS_TOKEN');
      this.setState({accessToken:r})
      console.log(r);
  }
  componentDidMount(){
      this._getAccessToken()
  }
    render() {
      const { navigation } = this.props;
      const fileList = navigation.getParam('fileList', []);
      return (
        <View style={{flex:1}}>
          <List dataArray={fileList}
                    renderRow={(item) =>
                      <ListItem>
                        <Left>
                        <Text>{item.name}</Text>  
                        </Left>
                        <Right>
                        <Button style={{ backgroundColor: "#f98267" }} onPress={
                          ()=>{
                            this._loadFile(item);
                                                      
                            }}>
                        <Text style={{paddingLeft:10, paddingRight:10, color:'#fff'}}>Restore</Text>
                      </Button>              </Right>
                      </ListItem>
                    }>
                  </List>
          </View>
      );
    }
  }