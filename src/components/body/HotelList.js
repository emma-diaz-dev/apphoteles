'use strict'

import React, { Component } from 'react';
import {
  Platform,
  Text,
  TouchableHighlight,
  Alert,
  Image,
  View,
  ListView,
  TextInput,
  BackHandler
} from 'react-native';
import {connect} from 'react-redux';
const {navBarC,hotelRowStyle,textInput,bodyStyle,backgroundImage,btnStyle,rowListViewStyle,listViewStyle,nameHotelStyle,detalleHotelStyle} = require('./styles.js');
const JSONHoteles = require('../../db/hoteles.js');
const HotelDetail = require('../detail/hotelDetail.js');
const Stars = require('../stars/stars.js');
const Search = require('../search/search.js');
const InfoMsg = require('../customMessages/infoMsg.js');


class Body extends Component{
  constructor(props){
    super(props);
    this.state = {
      text:'',
      dataSource: new ListView.DataSource({
        rowHasChanged:(row1,row2)=>row1 !== row2
      }),
      loaded:false,
      showEmpty:false
    }
  }
  componentDidMount(){
    console.log(this.props.hoteles);
    this.fetchData();
  }
  fetchData(){
    this.setState({
      dataSource:this.state.dataSource.cloneWithRows(this.props.hoteles),
      loaded:true
    });
  }
  renderLoadingView(){
    return(
      <View style={bodyStyle}>
        <Text>Loading...</Text>
      </View>
    );
  }
  renderHotel(hotel){
    return(
      <TouchableHighlight key={hotel.id+'12'} style={btnStyle} onPress={()=>{this.props.detailFunction(hotel)}}>
        <View style={hotelRowStyle}>
          <Image source={{uri:hotel.uri}} style={backgroundImage}
          resizeMode="cover"
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          >
          </Image>
          <View style={navBarC}
          borderBottomLeftRadius={10}
          borderBottomRightRadius={10}
          >
            <Text style={nameHotelStyle}>{hotel.name}</Text>
            <View style={{flexDirection:'row'}}>
              <Stars size={15} style={{marginRight:25}} cantStars={hotel.serviceType} color={'orange'}/>
              <Text style={detalleHotelStyle,{marginLeft:25}}>ARG {hotel.price}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
  filterSearch(text){
    const newData = this.props.hoteles.filter((item)=>{
      // const vectorNames = item.name.toLowerCase().trim().split(' ');
      // const vectorSearchs = text.toLowerCase().trim().split(' ');
      // var flag=false;
      // vectorSearchs.forEach((searchValue)=>{
      //   flag = false;
      //   vectorNames.forEach((nameValue)=>{
      //     if(nameValue.indexOf(searchValue)>-1){
      //       flag=true;
      //     }
      //   });
      //   if(!flag)return;
      // });
      // return flag;
        const nameValue = item.name.toLowerCase().trim();
        const searchValue = text.toLowerCase().trim();
        return nameValue.indexOf(searchValue)>-1
    })
    var flag = (newData == null || newData.length<1)
    this.setState({
      dataSource:this.state.dataSource.cloneWithRows(newData),
      text:text,
      showEmpty:flag
    });
  }
  render(){
      if(!this.state.loaded)return this.renderLoadingView();
      return(
        <View style={{flex:1}}>
          <Search
            filterSearch={(text)=>this.filterSearch(text)}
            text={this.state.text}
            />
        {!this.state.showEmpty && <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderHotel.bind(this)}
          style={listViewStyle,{marginBottom:10}}
          enableEmptySections={true}
        />}
        {this.state.showEmpty && <InfoMsg text={"We don't find elements"}/>

        }

    </View>
      );
  }
  onHotelPress(hotel){
    console.log('hola mundo');
  }
}
const mapStateToProps = state =>{
  return {hoteles:state.hoteles};
  //el libraries del state es el alias que se coloca en el reducers
  //el libraries del mapStateToProps es el que esta en el this.props
};
export default connect(mapStateToProps)(Body);