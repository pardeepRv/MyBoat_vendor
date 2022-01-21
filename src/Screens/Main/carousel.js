import Carousel from 'react-native-snap-carousel';
import React from 'react';
import config from '../../Constants/config';
import {
  Dimensions,
  Image,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  back_img3,
  boat_img1,
  Colors,
  FontFamily,
  Sizes,
} from '../../Constants/Constants';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Dots from 'react-native-dots-pagination';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height * 0.3;
export class MyCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      entries: props.data,
    };
  }

  _renderItem = ({item, index}) => {
    return (
      <Image
        source={{uri: config.imageUrl + item.image}}
        style={{
          width: width,
          height: height,
          resizeMode: 'stretch',
          // borderRadius:5,
          //overflow:'hidden',
          borderBottomRightRadius: 5,
          elevation:3,
          borderBottomLeftRadius: 5,
        }}
      />
    );
  };
  renderPaginationdots = () => {
    return (
      <View style={{ alignItems: 'center',height:30}}>
        <Dots
          length={this.state.entries.length}
          active={this.state.index}
          activeColor={Colors.orange}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={{alignItems: 'center',height:height}}>
        <TouchableOpacity
          onPress={this.props.goBack}
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios'? StatusBar.currentHeight + 25: StatusBar.currentHeight,
            left: 10,
            height: 35,
            width: 35,
            elevation: 3,
            backgroundColor: '#fff',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
          <AntDesign name="left" size={15} />
        </TouchableOpacity>
        {/* <View style={{backgroundColor:'yellow'}}> */}
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          onSnapToItem={slideIndex => {
            this.setState({index: slideIndex});
          }}
          
          data={this.state.entries}
          renderItem={this._renderItem}
          sliderWidth={width}
          itemWidth={width}
          itemHeight={height}
        />

        {/* </View> */}
        
        {this.renderPaginationdots()}
      </View>
    );
  }
}

export default MyCarousel;
