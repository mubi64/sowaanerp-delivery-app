import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Image,
  Animated,
  Pressable,
} from 'react-native';
import {
  BACKGROUND_COLOR,
  PRIMARY_GRADIENT_COLOR,
  SECONDARY_GRADIENT_COLOR,
} from '../../constant/color';
import MapViewDirections from 'react-native-maps-directions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Input, Icon, Divider} from '@rneui/base';
import MapView, {PROVIDER_GOOGLE, Polyline,Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {urlForSignUp} from '../../constant/baseurl';
import GetMethod from '../../NetworkCalls/get';
import PostMethod from '../../NetworkCalls/post';
import PutMethod from '../../NetworkCalls/put';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {baseUrlforImage} from '../../constant/baseurl';
import FastImage from 'react-native-fast-image';
import { Tab, TabView } from '@rneui/themed';
import SlideButton from 'rn-slide-button';
import LinearGradient from 'react-native-linear-gradient';
import { DeleteItem, GetItem } from '../../asyncstorage/function';

var interval;
const MyOrders = props => {
  const ref = React.useRef(null);
  const [animated, setBounceValue] = useState(new Animated.Value(-50));
  const orderItemAnimation = useRef(new Animated.Value(0)).current;
  const duration = 1000;
  const [selectedItem, setSelectedItem] = useState('All');
  const [refresh,setRefresh] = useState(false)
  const [orderData, setOrderData] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  //Is the animated view hidden or not?
  const [isHidden, setIsHidden] = useState(true);
  const [viewItems, setViewItems] = useState(true);
  const [animationBottom] = React.useState(new Animated.Value(0));
  const [loader, setLoader] = React.useState(true);
  const [detailsObj, setDetailsObj] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [active, setActive] = React.useState([])
  const [cancel,setCancel] = React.useState([])
  const [deliver, setDeliver] = React.useState([]) 
  const [newOrder, setNewOrder] = React.useState(false)
  const [animateprog, setAnimateProgress] = useState(1)
  const [name, setName] = useState('')
  const [greetingText,setGreetingText] = useState('')
  

  //I toggle the animated slide with this method
 
  const getTimeofOrder = time => {
    const arrayOfItems = time.split(' ');
    return arrayOfItems[1].substring(0, 5);
  };
  const bringUpActionSheet = () => {
    Animated.timing(animationBottom, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const endUpActionSheet = () => {
    Animated.timing(animationBottom, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(()=>setNewOrder(false));
  };
  const actionSheetInterpolate = animationBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [-hp('100%'), 0],
    extrapolate: 'clamp',
  });
  const getCustomerAddressForOrder = async (i) => {

    const getAddresslatlng = await GetMethod(
      urlForSignUp,
      undefined,
      `resource/Address/${i.shipping_address_name}`,
    );
  
    const parseGetAddressLatLng = await getAddresslatlng.json();
  
   i.lat = parseFloat(parseGetAddressLatLng.data.latitude);
   i.lng = parseFloat(parseGetAddressLatLng.data.longitude);
  
     return i
  }
  const getOrders = async () => {
    const getData = await GetItem('user');
    const getparseData = await JSON.parse(getData);
    const array = []
      const getOrdersData = await GetMethod(
        urlForSignUp,
        undefined,
        `resource/Sales Order??limit_page_length=5000&fields=["*"]&filters=[["assign_to_rider","=","${getparseData.employeeNumber}"]]`,
      );
      const parseDataInJSON = await getOrdersData.json();
      for (var j = 0; j <= parseDataInJSON.data.length-1; j++){
       
        const dat = await getCustomerAddressForOrder(parseDataInJSON.data[j])
        array.push(dat)

      }
      const activeOrders = array.filter(item => {
         return (item.order_status !== 'Delivered' && item.order_status !== 'Cancelled' )
      })
      const cancelledOrders = array.filter(item => {
        return item.order_status === 'Cancelled' 
      })
      const deliveredOrders = array.filter(item => {
        return item.order_status === 'Delivered'
     })
      console.log('dwqd',JSON.stringify(activeOrders,null,2))
      // console.log('dwqd',JSON.stringify(array,null,2))
      setActive(activeOrders)
      setDeliver(deliveredOrders)
      setCancel(cancelledOrders)
    setLoader(false)
    setRefresh(false)
  }
  React.useEffect(() => {
    const fetch = async () => {
      var today = new Date()
var curHr = today.getHours()

if (curHr < 12) {
  setGreetingText('Good morning')
} else if (curHr < 18) {
  setGreetingText('Good Afternoon')
} else {
  setGreetingText('Good Evening')
}
      const array = []
      const getData = await GetItem('user');
      const getparseData = await JSON.parse(getData);
      console.log('wdwadwa',getparseData)
     setName(getparseData.name)
      const getOrdersData = await GetMethod(urlForSignUp,undefined,`resource/Sales Order?limit_page_length=5000&fields=["*"]&filters=[["assign_to_rider","=","${getparseData.employeeNumber}"]]`);
      const parseDataInJSON = await getOrdersData.json();
      console.log('dawdweeyy',JSON.stringify(parseDataInJSON,null,2))
      for (var j = 0; j <= parseDataInJSON.data.length-1; j++){
       
        const dat = await getCustomerAddressForOrder(parseDataInJSON.data[j])
        array.push(dat)

      }
      const activeOrders = array.filter(item => {
         return (item.order_status !== 'Delivered' && item.order_status !== 'Cancelled')
      })
      const cancelledOrders = array.filter(item => {
        return item.order_status === 'Cancelled' 
      })
      const deliveredOrders = array.filter(item => {
        return item.order_status === 'Delivered'
     })
      console.log('dwqd',JSON.stringify(activeOrders,null,2))
      // console.log('dwqd',JSON.stringify(array,null,2))

      setActive(activeOrders)
      setDeliver(deliveredOrders)
      setCancel(cancelledOrders)
      setLoader(false)
      // store.getState().ordersData.forEach(async (item, index) => {
      //   const lt = await getAddresslat(item.customer_address);
      //   const ln = await getAddresslong(item.customer_address);

      //   item.lat = lt;
      //   item.lng = ln;
      //   // console.log(JSON.stringify(item,null,2))
      //   if (index === store.getState().ordersData.length - 1) {
      //     array.push(item);
      //     await setOrderData(store.getState().ordersData);
      //     setLoader(false);
      //   } else {
      //     array.push(item);
      //   }
      // });

      // setOrderData(store.getState().ordersData)
    };
    fetch();
  }, []);
  removeTagsFromString = (stringData) => {
    return stringData.replace( /(<([^>]+)>)/ig, '');
  }
  const getAddresslat = address_name => {
    const filteredArray = store.getState().addresses.filter(item => {
      return item.name === address_name;
    });

    return parseFloat(filteredArray[0].latitude);
  };
  const orderRejected = async (name) => {
    setLoader(true)
    const res= await PutMethod(
      urlForSignUp,
      {
        assign_to_rider:null,
      },
      `resource/Sales Order/${(detailsObj)?name:null}`,
    )
    if (res.error !== undefined) {
      setLoader(false)
      Toast.show({
        type: 'error',
        position: "top",
        text1: `${res.error}👋`
      });
      
    }
    else {
      endUpActionSheet()
      clearInterval(interval)
      setDetailsObj(null)
      setAnimateProgress(0)
      getOrders()
    }
    // setTimeout(() => {
    //   setAnimating(false)
    // }, 5000)
  }
  const getItemsofOrder = async (saleOrderName) => {
    setLoader(true);

    const data = await GetMethod(
      urlForSignUp,
      undefined,
      `method/frappe.client.get_list?doctype=Sales Order Item&parent=Sales Order&fields=["item_code", "qty", "is_topping", "topings", "image","amount"]&filters=[["parent","=","${saleOrderName}"],["is_topping","=",0]]&page_length_limit=5000`,
    );
    const parseData = await data.json();

    const arr = parseData.message.map(item => {
      const parseJSONdataToppings = JSON.parse(item.topings);
      item.topings = parseJSONdataToppings;
      return item;
    });
    setOrderItems(arr);
    setLoader(false);
    bringUpActionSheet();
  };
  const getAddresslong = async address_name => {
    const filteredArray = store.getState().addresses.filter(item => {
      return item.name === address_name;
    });
    return parseFloat(filteredArray[0].longitude);
  };
  const viewPendingOrder = async() => {
   
    setNewOrder(true)
    bringUpActionSheet()
  interval = setInterval(()=>{

      setAnimateProgress((animateprog) =>{
          if(animateprog < 30){
              return animateprog + 1
          }
          else {
            if (detailsObj !== null) {
              orderRejected(detailsObj.name)
            }
            endUpActionSheet()
            clearInterval(interval)
            
            return 0
          }
      } )
  

    }, 1000)
    
 }
  return (
    <>
      {/* <Image
        source={require('./../../assets/images/Vector.png')}
        style={{
          width: wp('100%'),
          height: hp('100%'),
          position: 'absolute',
          top: wp(-90),
          right: wp(-42),
          opacity: 0.19,
          transform: [{rotate: '45deg'}],
          shadowOpacity: 0.1,
          resizeMode: 'contain',
        }}
      /> */}

      <View
        style={styles.container}
        onTouchEnd={() => {
          if (isHidden === false) {
            setIsHidden(true);
          }
        }}>
       
        <LinearGradient
              colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                width: wp('100%'),
                height: hp('20%'),
        
                alignSelf: 'center',
                bottom: hp(2),
              }}>
          <Image
                source={require('./../../assets/images/Group.png')}
                style={{
                  width: wp('90%'),
                  height: 200,
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  opacity: 0.2,
                }}
            />
            <View style={{ height: hp('3%') }}></View>
            <Pressable
                   style={({pressed}) => [
                     {
                       width: wp('14%'),
                       opacity: pressed ? 0.2 : 1,
                      height: hp('6%'),
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      borderRadius: 8,
                      alignSelf: 'flex-end',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 9,
                      },
                      shadowOpacity: 0.48,
                      shadowRadius: 11.95,
                      elevation: 2,
                      marginRight:wp(3)
                     },
                   ]}
                   onPress={() => {
                     // console.log('swqdqwd', JSON.stringify(item, null, 2));
                     // setDetailsObj(item);
                     // getItemsofOrder(item.name);
                     DeleteItem('user')
                     props.navigation.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    })
                     
              }}>
               <Icon
                name="poweroff"
                color={PRIMARY_GRADIENT_COLOR}
                type="antdesign"
                size={wp(6)}
              />
                   </Pressable>
              
            <View style={{height:hp('1.5%')}}></View>
             <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              color: 'white',
              fontWeight: 'bold',
              marginLeft: hp(3),
              marginTop: hp(.5),
            }}>
              {greetingText}!
            </Text>
            <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.5),
              color: 'white',
              fontWeight: '600',
              marginLeft: hp(3),
              marginTop: hp(.5),
            }}>
            {name}
          </Text>
            </LinearGradient>
          <View style={{height: hp('1%')}} />

          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.5),
              color: 'black',
              fontWeight: '700',
              width: wp('70%'),
              marginLeft: hp(3),
            }}>
            My Order List
          </Text>

          <View style={{height: hp('2%')}} />
          <Tab
            value={index}
            onChange={e => setIndex(e)}
            indicatorStyle={{
              backgroundColor:SECONDARY_GRADIENT_COLOR,
            }}
            buttonStyle={(active) => [
              {
                backgroundColor:(active)?'white':SECONDARY_GRADIENT_COLOR
              },
            ]}
            style={{width: wp('95%'), alignSelf: 'center'}}
            containerStyle={{width: wp('95%'), alignSelf: 'center'}}
            variant="primary">
            <Tab.Item
              title="Active"
              titleStyle={(active) => [
                {
                  color: (active) ? SECONDARY_GRADIENT_COLOR : 'white',
                  fontSize: wp(4.5), fontWeight: 'bold'
                },
              ]}
            />
            <Tab.Item
              title="Cancel"
              titleStyle={(active) => [
                {
                  color: (active) ? SECONDARY_GRADIENT_COLOR : 'white',
                  fontSize: wp(4.5), fontWeight: 'bold'
                },
              ]}
            />
            <Tab.Item
              title="Delivered"
              titleStyle={(active) => [
                {
                  color: (active) ? SECONDARY_GRADIENT_COLOR : 'white',
                  fontSize: wp(4.5), fontWeight: 'bold'
                },
              ]}
            />
        </Tab>
        <ScrollView ref={ref}
               refreshControl={
                <RefreshControl
                    refreshing={refresh}
                   onRefresh={() => {
                    setRefresh(true)
                    getOrders()
                    }} 
                />
            }
             
        >
          <View style={{height: hp('2%')}} />
          {(index === 0) ?
          active.map((item, index) => {
            return (
              <>
           
                   <View
                   style={{
                     width: wp('96%'),
                     height: 'auto',
                     backgroundColor: 'white',
                     borderRadius: 8,
                     alignSelf: 'center',
                     shadowColor: '#5A6CEA12',
                     shadowOffset: {
                       width: 0,
                       height: 9,
                     },
                     shadowOpacity: 0.48,
                     shadowRadius: 11.95,
                     elevation: 10,
                     paddingVertical: hp(3),
                     borderWidth: 2,
                     borderColor: '#f5f5f5',
                   }}>
                   <View
                     style={{
                       width: wp('90%'),
                       alignSelf: 'center',
                       flexDirection: 'row',
                       justifyContent: 'space-between',
                     }}>
                     <View style={{flexDirection: 'row'}}>
                       <Icon
                         name="receipt"
                         type="ionicon"
                         color={SECONDARY_GRADIENT_COLOR}
                       />
                       <Text
                         allowFontScaling={false}
                         style={{
                           fontFamily: 'Proxima Nova',
                           fontSize: hp(2.2),
                           color: 'black',
                           fontWeight: '700',
                           marginLeft: hp(1),
                           alignSelf: 'center',
                         }}>
                         Order Id # {item.name.substring(8, item.name.length)}
                       </Text>
                     </View>
                     <View
                       style={{
                         width: 'auto',
                         height: hp('3.5%'),
                         justifyContent: 'center',
                         alignItems: 'center',
                         paddingHorizontal: hp(2),
                         borderRadius: 25,
                         borderWidth: 2,
                         borderColor: SECONDARY_GRADIENT_COLOR,
                         backgroundColor: 'rgba(197,129,249,0.3)',
                       }}>
                       <Text
                         style={{
                           fontFamily: 'Proxima Nova',
                           fontSize: hp(2.2),
                           color: 'black',
                         }}>
                         {item.order_status}
                       </Text>
                     </View>
                   </View>
                   {/* <MapView
                     provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                     style={{
                       width: wp('90%'),
                       height: hp('15%'),
                       alignSelf: 'center',
                       marginTop: hp(2),
                     }}
                     region={{
                       latitude: item.lat,
                       longitude: item.lng,
                       latitudeDelta: 0.03,
                       longitudeDelta: 0.03,
                     }}
                     liteMode={true}>
                     <Marker
                       coordinate={{latitude: item.lat, longitude: item.lng}}>
                       <Icon
                         name="location"
                         type="ionicon"
                         color={SECONDARY_GRADIENT_COLOR}
                         size={hp(5)}
                       />
                     </Marker>
                   </MapView> */}
                   <Divider style={{marginVertical: hp(2)}} />
                   <View
                     style={{
                       width: wp('90%'),
                       alignSelf: 'center',
                     }}>
                     <View
                       style={{
                         flexDirection: 'row',
                         justifyContent: 'space-between',
                       }}>
                       <Text
                         allowFontScaling={false}
                         style={{
                           fontFamily: 'Proxima Nova',
                           fontSize: hp(1.8),
                           color: 'gray',
                           fontWeight: '700',
                         }}>
                         Order On
                       </Text>
                       <Text
                         allowFontScaling={false}
                         style={{
                           fontFamily: 'Proxima Nova',
                           fontSize: hp(1.8),
                           color: 'gray',
                           fontWeight: '700',
                         }}>
                         {/* Total Items: {item.total_qty} */}{' '}
                         {item.delivery_date} {getTimeofOrder(item.creation)}
                       </Text>
                     </View>
                   </View>
                   <View
                     style={{
                       width: wp('90%'),
                       alignSelf: 'center',
                       marginTop: wp(1.5),
                     }}>
                     {/* <View
                       style={{
                         flexDirection: 'row',
                         justifyContent: 'space-between',
                       }}>
                       <Text
                         allowFontScaling={false}
                         style={{
                           fontFamily: 'Proxima Nova',
                           fontSize: hp(2),
                           fontWeight: '700',
                         }}>
                         {getTimeofOrder(item.creation)}
                       </Text>
                       <Pressable
                         style={({pressed}) => [
                           {
                             opacity: pressed ? 0.2 : 1,
                             flexDirection: 'row',
                           },
                         ]}
                         onPressIn={() => {
                           getItemsofOrder(item.name);
                           // getItemsofOrder(item.name)
                         }}>
                         <Text
                           allowFontScaling={false}
                           style={{
                             fontFamily: 'Proxima Nova',
                             fontSize: hp(2),
                             color: SECONDARY_GRADIENT_COLOR,
                             fontWeight: '700',
                           }}>
                           {'View items'}
                         </Text>
                         <Icon
                           containerStyle={{
                             marginLeft: wp(2),
                             paddingVertical: wp(0.5),
                           }}
                           name={viewItems ? 'down' : 'up'}
                           type="antdesign"
                           color={SECONDARY_GRADIENT_COLOR}
                           size={hp(2.5)}
                         />
                       </Pressable>
                     </View> */}
                   </View>
                   <View
                     style={{
                       width: wp('90%'),
                       alignSelf: 'center',
                       marginTop: wp(1.5),
                     }}>
                     <View
                       style={{
                         flexDirection: 'row',
                         justifyContent: 'space-between',
                       }}>
                       <Text
                         allowFontScaling={false}
                         style={{
                           fontFamily: 'Proxima Nova',
                           fontSize: hp(1.8),
                           color: 'gray',
                           fontWeight: '700',
                         }}>
                         Order Address
                       </Text>
                       <Text
                         allowFontScaling={false}
                         style={{
                           fontFamily: 'Proxima Nova',
                           fontSize: hp(1.8),
                           color: 'gray',
                           fontWeight: '700',
                         }}>
                         {item?.shipping_address?.slice(0, 32)}...
                         {/* Total: {item.net_total} PKR */}
                       </Text>
                     </View>
 
                     {/* <View
                       style={{
                         flexDirection: 'row',
                         justifyContent: 'space-between',
                       }}>
                       <Text
                         allowFontScaling={false}
                         style={{
                           fontFamily: 'Proxima Nova',
                           fontSize: hp(2),
                           fontWeight: '700',
                         }}>
                         {getTimeofOrder(item.creation)}
                       </Text>
                       <Pressable
                         style={({pressed}) => [
                           {
                             opacity: pressed ? 0.2 : 1,
                             flexDirection: 'row',
                           },
                         ]}
                         onPressIn={() => {
                           getItemsofOrder(item.name);
                           // getItemsofOrder(item.name)
                         }}>
                         <Text
                           allowFontScaling={false}
                           style={{
                             fontFamily: 'Proxima Nova',
                             fontSize: hp(2),
                             color: SECONDARY_GRADIENT_COLOR,
                             fontWeight: '700',
                           }}>
                           {'View items'}
                         </Text>
                         <Icon
                           containerStyle={{
                             marginLeft: wp(2),
                             paddingVertical: wp(0.5),
                           }}
                           name={viewItems ? 'down' : 'up'}
                           type="antdesign"
                           color={SECONDARY_GRADIENT_COLOR}
                           size={hp(2.5)}
                         />
                       </Pressable>
                     </View> */}
                   </View>
                   <Divider style={{marginVertical: hp(2)}} />
                   <View
                     style={{
                       width: wp('90%'),
                       alignSelf: 'center',
                       alignItems: 'flex-end',
                       justifyContent: 'center',
                     }}>
                     <Pressable
                       style={({pressed}) => [
                         {
                           opacity: pressed ? 0.2 : 1,
                           width: wp('30%'),
                           borderRadius: wp(1),
                           paddingVertical: wp(2.5),
                           backgroundColor: SECONDARY_GRADIENT_COLOR,
                           alignItems: 'center',
                           justifyContent: 'center',
                         },
                       ]}
                       onPress={() => {
                         
                         setDetailsObj(item);
                         if (item.order_status === "Pending") {
                           viewPendingOrder()
                         }
                         else {
                           getItemsofOrder(item.name);
                         }
                         
                       }}>
                       <Text
                         allowFontScaling={false}
                         style={{
                           fontFamily: 'Proxima Nova',
                           fontSize: hp(2),
                           color: 'white',
                           fontWeight: '700',
                         }}>
                         View Details
                       </Text>
                     </Pressable>
                   </View>
                 </View>
              
                <View style={{height: hp('2%')}} />
              </>
            );
          }) : (index === 1) ?
          cancel.map((item, index) => {
            return (
              <>
                <View
                  style={{
                    width: wp('96%'),
                    height: 'auto',
                    backgroundColor: 'white',
                    borderRadius: 8,
                    alignSelf: 'center',
                    shadowColor: '#5A6CEA12',
                    shadowOffset: {
                      width: 0,
                      height: 9,
                    },
                    shadowOpacity: 0.48,
                    shadowRadius: 11.95,
                    elevation: 10,
                    paddingVertical: hp(3),
                    borderWidth: 2,
                    borderColor: '#f5f5f5',
                  }}>
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        name="receipt"
                        type="ionicon"
                        color={SECONDARY_GRADIENT_COLOR}
                      />
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.2),
                          color: 'black',
                          fontWeight: '700',
                          marginLeft: hp(1),
                          alignSelf: 'center',
                        }}>
                        Order Id # {item.name.substring(8, item.name.length)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 'auto',
                        height: hp('3.5%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: hp(2),
                        borderRadius: 25,
                        borderWidth: 2,
                        borderColor: SECONDARY_GRADIENT_COLOR,
                        backgroundColor: 'rgba(197,129,249,0.3)',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.2),
                          color: 'black',
                        }}>
                        {item.order_status}
                      </Text>
                    </View>
                  </View>
                  {/* <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{
                      width: wp('90%'),
                      height: hp('15%'),
                      alignSelf: 'center',
                      marginTop: hp(2),
                    }}
                    region={{
                      latitude: item.lat,
                      longitude: item.lng,
                      latitudeDelta: 0.03,
                      longitudeDelta: 0.03,
                    }}
                    liteMode={true}>
                    <Marker
                      coordinate={{latitude: item.lat, longitude: item.lng}}>
                      <Icon
                        name="location"
                        type="ionicon"
                        color={SECONDARY_GRADIENT_COLOR}
                        size={hp(5)}
                      />
                    </Marker>
                  </MapView> */}
                  <Divider style={{marginVertical: hp(2)}} />
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        Order On
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        {/* Total Items: {item.total_qty} */}{' '}
                        {item.delivery_date} {getTimeofOrder(item.creation)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      marginTop: wp(1.5),
                    }}>
                    {/* <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          fontWeight: '700',
                        }}>
                        {getTimeofOrder(item.creation)}
                      </Text>
                      <Pressable
                        style={({pressed}) => [
                          {
                            opacity: pressed ? 0.2 : 1,
                            flexDirection: 'row',
                          },
                        ]}
                        onPressIn={() => {
                          getItemsofOrder(item.name);
                          // getItemsofOrder(item.name)
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2),
                            color: SECONDARY_GRADIENT_COLOR,
                            fontWeight: '700',
                          }}>
                          {'View items'}
                        </Text>
                        <Icon
                          containerStyle={{
                            marginLeft: wp(2),
                            paddingVertical: wp(0.5),
                          }}
                          name={viewItems ? 'down' : 'up'}
                          type="antdesign"
                          color={SECONDARY_GRADIENT_COLOR}
                          size={hp(2.5)}
                        />
                      </Pressable>
                    </View> */}
                  </View>
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      marginTop: wp(1.5),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        Order Address
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                         {item?.shipping_address?.slice(0, 32)}...
                        {/* Total: {item.net_total} PKR */}
                      </Text>
                    </View>

                    {/* <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          fontWeight: '700',
                        }}>
                        {getTimeofOrder(item.creation)}
                      </Text>
                      <Pressable
                        style={({pressed}) => [
                          {
                            opacity: pressed ? 0.2 : 1,
                            flexDirection: 'row',
                          },
                        ]}
                        onPressIn={() => {
                          getItemsofOrder(item.name);
                          // getItemsofOrder(item.name)
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2),
                            color: SECONDARY_GRADIENT_COLOR,
                            fontWeight: '700',
                          }}>
                          {'View items'}
                        </Text>
                        <Icon
                          containerStyle={{
                            marginLeft: wp(2),
                            paddingVertical: wp(0.5),
                          }}
                          name={viewItems ? 'down' : 'up'}
                          type="antdesign"
                          color={SECONDARY_GRADIENT_COLOR}
                          size={hp(2.5)}
                        />
                      </Pressable>
                    </View> */}
                  </View>
                  <Divider style={{marginVertical: hp(2)}} />
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}>
                    <Pressable
                      style={({pressed}) => [
                        {
                          opacity: pressed ? 0.2 : 1,
                          width: wp('30%'),
                          borderRadius: wp(1),
                          paddingVertical: wp(2.5),
                          backgroundColor: SECONDARY_GRADIENT_COLOR,
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}
                      onPress={() => {
                        console.log('swqdqwd', JSON.stringify(item, null, 2));
                        setDetailsObj(item);
                        getItemsofOrder(item.name);
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          color: 'white',
                          fontWeight: '700',
                        }}>
                        View Details
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View style={{height: hp('2%')}} />
              </>
            );
          }) : deliver.map((item, index) => {
            return (
              <>
                <View
                  style={{
                    width: wp('96%'),
                    height: 'auto',
                    backgroundColor: 'white',
                    borderRadius: 8,
                    alignSelf: 'center',
                    shadowColor: '#5A6CEA12',
                    shadowOffset: {
                      width: 0,
                      height: 9,
                    },
                    shadowOpacity: 0.48,
                    shadowRadius: 11.95,
                    elevation: 10,
                    paddingVertical: hp(3),
                    borderWidth: 2,
                    borderColor: '#f5f5f5',
                  }}>
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        name="receipt"
                        type="ionicon"
                        color={SECONDARY_GRADIENT_COLOR}
                      />
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.2),
                          color: 'black',
                          fontWeight: '700',
                          marginLeft: hp(1),
                          alignSelf: 'center',
                        }}>
                        Order Id # {item.name.substring(8, item.name.length)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 'auto',
                        height: hp('3.5%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: hp(2),
                        borderRadius: 25,
                        borderWidth: 2,
                        borderColor: SECONDARY_GRADIENT_COLOR,
                        backgroundColor: 'rgba(197,129,249,0.3)',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2.2),
                          color: 'black',
                        }}>
                        {item.order_status}
                      </Text>
                    </View>
                  </View>
                  {/* <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{
                      width: wp('90%'),
                      height: hp('15%'),
                      alignSelf: 'center',
                      marginTop: hp(2),
                    }}
                    region={{
                      latitude: item.lat,
                      longitude: item.lng,
                      latitudeDelta: 0.03,
                      longitudeDelta: 0.03,
                    }}
                    liteMode={true}>
                    <Marker
                      coordinate={{latitude: item.lat, longitude: item.lng}}>
                      <Icon
                        name="location"
                        type="ionicon"
                        color={SECONDARY_GRADIENT_COLOR}
                        size={hp(5)}
                      />
                    </Marker>
                  </MapView> */}
                  <Divider style={{marginVertical: hp(2)}} />
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        Order On
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        {/* Total Items: {item.total_qty} */}{' '}
                        {item.delivery_date} {getTimeofOrder(item.creation)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      marginTop: wp(1.5),
                    }}>
                    {/* <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          fontWeight: '700',
                        }}>
                        {getTimeofOrder(item.creation)}
                      </Text>
                      <Pressable
                        style={({pressed}) => [
                          {
                            opacity: pressed ? 0.2 : 1,
                            flexDirection: 'row',
                          },
                        ]}
                        onPressIn={() => {
                          getItemsofOrder(item.name);
                          // getItemsofOrder(item.name)
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2),
                            color: SECONDARY_GRADIENT_COLOR,
                            fontWeight: '700',
                          }}>
                          {'View items'}
                        </Text>
                        <Icon
                          containerStyle={{
                            marginLeft: wp(2),
                            paddingVertical: wp(0.5),
                          }}
                          name={viewItems ? 'down' : 'up'}
                          type="antdesign"
                          color={SECONDARY_GRADIENT_COLOR}
                          size={hp(2.5)}
                        />
                      </Pressable>
                    </View> */}
                  </View>
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      marginTop: wp(1.5),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
                        Order Address
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(1.8),
                          color: 'gray',
                          fontWeight: '700',
                        }}>
 {item?.shipping_address?.slice(0, 32)}...
                        {/* Total: {item.net_total} PKR */}
                      </Text>
                    </View>

                    {/* <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          fontWeight: '700',
                        }}>
                        {getTimeofOrder(item.creation)}
                      </Text>
                      <Pressable
                        style={({pressed}) => [
                          {
                            opacity: pressed ? 0.2 : 1,
                            flexDirection: 'row',
                          },
                        ]}
                        onPressIn={() => {
                          getItemsofOrder(item.name);
                          // getItemsofOrder(item.name)
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2),
                            color: SECONDARY_GRADIENT_COLOR,
                            fontWeight: '700',
                          }}>
                          {'View items'}
                        </Text>
                        <Icon
                          containerStyle={{
                            marginLeft: wp(2),
                            paddingVertical: wp(0.5),
                          }}
                          name={viewItems ? 'down' : 'up'}
                          type="antdesign"
                          color={SECONDARY_GRADIENT_COLOR}
                          size={hp(2.5)}
                        />
                      </Pressable>
                    </View> */}
                  </View>
                  <Divider style={{marginVertical: hp(2)}} />
                  <View
                    style={{
                      width: wp('90%'),
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}>
                    <Pressable
                      style={({pressed}) => [
                        {
                          opacity: pressed ? 0.2 : 1,
                          width: wp('30%'),
                          borderRadius: wp(1),
                          paddingVertical: wp(2.5),
                          backgroundColor: SECONDARY_GRADIENT_COLOR,
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}
                      onPress={() => {
                        console.log('swqdqwd', JSON.stringify(item, null, 2));
                        setDetailsObj(item);
                        getItemsofOrder(item.name);
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          color: 'white',
                          fontWeight: '700',
                        }}>
                        View Details
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View style={{height: hp('2%')}} />
              </>
            );
          })}
         
         </ScrollView>
      
      </View>
      
      <Animated.View
        style={{
          width: wp('100%'),
          height: hp('100%'),
          position: 'absolute',
          bottom: actionSheetInterpolate,
          backgroundColor: 'white',
        }}>
      <NewOrder detailsObj={detailsObj} orderItems={orderItems} loader={loader} setLoader={setLoader} getOrders={getOrders} endUpActionSheet={endUpActionSheet} />

        </Animated.View>
      {newOrder ? 
        <Animated.View
        style={{
          width: wp('100%'),
          height: hp('100%'),
          position: 'absolute',
          bottom: actionSheetInterpolate,
          backgroundColor: 'white',
          }}>
          
        <View style={{height: hp('4%')}}></View>
      

        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2.5),
            color: 'black',
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          New Order
      </Text>
      
     
      <View style={{ height: hp('1%') }}></View>
      <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(8),
            color: 'black',
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          {animateprog}
        </Text>
      <View style={{ height: hp('1%') }}></View>
      <View style={{ height: hp('1%') }}></View>
      <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2),
            color: 'black',
            fontWeight: '600',
            alignSelf: 'center',
          }}>
        You have to accept this in 30 seconds
        </Text>
            <View style={{ height: hp('1%') }}></View>
        <ScrollView>
          <View style={{width: wp('95%'), alignSelf: 'center'}}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
              Your route
            </Text>
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{
                width: wp('90%'),
                height: hp('20%'),
                alignSelf: 'center',
                marginTop: hp(2),
                borderRadius: hp(5),
              }}
              region={{
                latitude: detailsObj ? detailsObj.lat : 0,
                longitude: detailsObj ? detailsObj.lng : 0,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
          >
            <MapViewDirections
              origin={{ latitude: 24.8601, longitude: 67.0565 }}
              destination={{ latitude:24.9372, longitude:67.423 }}
          waypoints={[
            { latitude: 24.9281, longitude:67.0879}
          ]}
          apikey={'AIzaSyDZJsqUrsfEJVX0fGVJbjAmD1g64W6I3ZE'} // insert your API Key here
          strokeWidth={4}
          strokeColor="#111111"
        />
         
            </MapView>
          </View>

          <View style={{height: hp('2%')}}></View>
          <Divider style={{marginVertical: hp(1.5)}} />
        <View style={{ width: wp('90%'), alignSelf: 'center',justifyContent:'space-between',flexDirection:'row'}}>
          <View style={{flexDirection:'row'}}>
            <Icon
              name='shop'
              type='entypo'
              color={'black'}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
              Pick-Up Location
            </Text>
          </View>
          <View style={{flexDirection:'row'}}>
          <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
              6 min,
            </Text>

            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
             2 Km
            </Text>
            </View>
        </View>
        <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '600',
                width: wp('88%'),
                alignSelf:'center'
              }}>
             {detailsObj ? `${detailsObj.branch}` : null}
            </Text>
          {/* <View>
            {orderItems.length > 0 &&
              orderItems.map(item => {
                return (
                  <View
                    style={{
                      backgroundColor: 'white',
                      height: 'auto',
                      paddingVertical: hp(2),
                      width: wp('90%'),
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <FastImage
                        source={{
                          uri: `${baseUrlforImage}${item.image}`,
                          priority: FastImage.priority.high,
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 60 / 2,
                          borderWidth: 2,
                          borderColor: SECONDARY_GRADIENT_COLOR,
                        }}
                        resizeMode="cover"
                      />
                      <View>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2),
                            fontWeight: 'bold',
                            marginLeft: wp(3),
                            width: wp('40%'),
                          }}>
                          {item.item_code}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            width: wp('45%'),
                            marginLeft: wp(1),
                            marginTop: wp(1),
                          }}>
                          {item.topings !== null
                            ? item.topings.map((ite, index) => {
                                return (
                                  <Text
                                    style={{marginLeft: hp(1), color: 'gray'}}>
                                    {ite.name +
                                      ' (' +
                                      item.qty +
                                      ' x ' +
                                      ite.rate +
                                      ' PKR)'}
                                    {item.topings.length - 1 === index
                                      ? null
                                      : ','}
                                  </Text>
                                );
                              })
                            : null}
                        </View>
                      </View>
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2),
                        fontWeight: 'bold',
                        marginLeft: wp(3),
                      }}>
                      {item.qty} x {item.amount} PKR
                    </Text>
                  </View>
                );
              })}
          </View> */}

          <View style={{height: hp('1%')}}></View>

          <Divider style={{marginVertical: hp(1.5)}} />
          <View style={{ width: wp('90%'), alignSelf: 'center',justifyContent:'space-between',flexDirection:'row'}}>
          <View style={{flexDirection:'row'}}>
            <Icon
              name='home'
              type='entypo'
              color={'black'}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
              Delivery Location
            </Text>
          </View>
          <View style={{flexDirection:'row'}}>
          <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
              6 min,
            </Text>

            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
             2 Km
            </Text>
            </View>
        </View>
        <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '600',
                width: wp('88%'),
                alignSelf:'center'
              }}>
             {detailsObj ? `${detailsObj?.shipping_address?.substring(0, detailsObj.shipping_address.indexOf('<'))}` : null}
            </Text>
        
      
          <View style={{height: hp('1%')}}></View>

          <Divider style={{marginVertical: hp(1.5)}} />
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginTop: wp(1.3),
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.7),
                color: '#AEC670',
                fontWeight: 'bold',
              }}>
              Amount Collection
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.7),
                color: '#AEC670',
                fontWeight: 'bold',
              }}>
              {detailsObj ? `${detailsObj.net_total} PKR` : null}
            </Text>
        </View>
        
        <View style={{height: hp('2%')}}></View>
        <View>
        <SlideButton
            title="Accept Order"
            icon={<Icon name='doubleright' type='antdesign' />}
            height={54}
            borderRadius={27}
            width={wp('80%')}
            autoReset={true}
            underlayStyle={{backgroundColor:SECONDARY_GRADIENT_COLOR}}
            containerStyle={{backgroundColor:SECONDARY_GRADIENT_COLOR}}
            onReachedToEnd={async() => {
              setLoader(true)
              const res= await PutMethod(
                urlForSignUp,
                {
                  order_status:'Rider Accepted',
                },
                `resource/Sales Order/${(detailsObj)?detailsObj.name:null}`,
              )
              if (res.error !== undefined) {
                setLoader(false)
                Toast.show({
                  type: 'error',
                  position: "top",
                  text1: `${res.error}👋`
                });
                
              }
              else {
                endUpActionSheet()
                getOrders()
              }
              // setTimeout(() => {
              //   setAnimating(false)
              // }, 5000)
            }}
            // reverseSlideEnabled
            reverseSlideEnabled
         
          />
        </View>
 
          <View style={{height: hp('4%')}}></View>
      </ScrollView>
      <Pressable
                      style={({pressed}) => [
                        {
                          opacity: pressed ? 0.2 : 1,
                          width: wp('20%'),
                          borderRadius: wp(8),
                          paddingVertical: wp(1.5),
                          backgroundColor:'red',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'absolute',
                          right: wp(2),
                          top:wp(7)
                        },
                      ]}
                      onPress={() => {
                        // console.log('swqdqwd', JSON.stringify(item, null, 2));
                        // setDetailsObj(item);
                        // getItemsofOrder(item.name);
                        if (detailsObj !== null) {
                          orderRejected(detailsObj.name)

                        }
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          color: 'white',
                          fontWeight: '700',
                        }}>
                        Deny
                      </Text>
                    </Pressable>
       

        {/* <NewOrder detailsObj={detailsObj} orderItems={orderItems} loader={loader} setLoader={setLoader} endUpActionSheet={endUpActionSheet} /> */}
        {/* <>
        <View style={{height: hp('4%')}}></View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: wp('95%'),
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              fontWeight: 'bold',
              marginLeft: wp(4),
            }}>
            Ordered Details
          </Text>
          <Icon
            name="close"
            type="antdesign"
            size={wp(7)}
            color="black"
            containerStyle={{alignSelf: 'center'}}
            onPress={() => endUpActionSheet()}
          />
        </View>
        <View style={{height: hp('4%')}}></View>

        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2.5),
            color: 'black',
            fontWeight: '700',
            marginLeft: hp(1),
            alignSelf: 'center',
          }}>
          Order Id #{' '}
          {detailsObj
            ? detailsObj.name.substring(8, detailsObj.name.length)
            : null}
        </Text>

        <View style={{height: hp('2%')}}></View>
        <ScrollView>
          <View style={{width: wp('95%'), alignSelf: 'center'}}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
              Delivery Address
            </Text>
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{
                width: wp('90%'),
                height: hp('20%'),
                alignSelf: 'center',
                marginTop: hp(2),
                borderRadius: hp(5),
              }}
              region={{
                latitude: detailsObj ? detailsObj.lat : 0,
                longitude: detailsObj ? detailsObj.lng : 0,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
              liteMode={true}>
              <Marker
                coordinate={{
                  latitude: detailsObj ? detailsObj.lat : 0,
                  longitude: detailsObj ? detailsObj.lng : 0,
                }}>
                <Icon
                  name="location"
                  type="ionicon"
                  color={SECONDARY_GRADIENT_COLOR}
                  size={hp(5)}
                />
              </Marker>
            </MapView>
          </View>

          <View style={{height: hp('2%')}}></View>
          <Divider style={{marginVertical: hp(1.5)}} />
          <View style={{width: wp('95%'), alignSelf: 'center'}}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
              Ordered Items
            </Text>
          </View>
          <View>
            {orderItems.length > 0 &&
              orderItems.map(item => {
                return (
                  <View
                    style={{
                      backgroundColor: 'white',
                      height: 'auto',
                      paddingVertical: hp(2),
                      width: wp('90%'),
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <FastImage
                        source={{
                          uri: `${baseUrlforImage}${item.image}`,
                          priority: FastImage.priority.high,
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 60 / 2,
                          borderWidth: 2,
                          borderColor: SECONDARY_GRADIENT_COLOR,
                        }}
                        resizeMode="cover"
                      />
                      <View>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Proxima Nova',
                            fontSize: hp(2),
                            fontWeight: 'bold',
                            marginLeft: wp(3),
                            width: wp('40%'),
                          }}>
                          {item.item_code}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            width: wp('45%'),
                            marginLeft: wp(1),
                            marginTop: wp(1),
                          }}>
                          {item.topings !== null
                            ? item.topings.map((ite, index) => {
                                return (
                                  <Text
                                    style={{marginLeft: hp(1), color: 'gray'}}>
                                    {ite.name +
                                      ' (' +
                                      item.qty +
                                      ' x ' +
                                      ite.rate +
                                      ' PKR)'}
                                    {item.topings.length - 1 === index
                                      ? null
                                      : ','}
                                  </Text>
                                );
                              })
                            : null}
                        </View>
                      </View>
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2),
                        fontWeight: 'bold',
                        marginLeft: wp(3),
                      }}>
                      {item.qty} x {item.amount} PKR
                    </Text>
                  </View>
                );
              })}
          </View>

          <View style={{height: hp('1%')}}></View>

          <Divider style={{marginVertical: hp(1.5)}} />
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '700',
              }}>
              Sub-Total
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '700',
              }}>
              {detailsObj ? `${detailsObj.net_total} PKR` : null}
            </Text>
          </View>
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginTop: wp(1.3),
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '600',
              }}>
              Delivery Charges
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '600',
              }}>
              {detailsObj ? `${0} PKR` : null}
            </Text>
          </View>
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginTop: wp(1.3),
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '600',
              }}>
              GST TAX
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '600',
              }}>
              {detailsObj ? `${0} PKR` : null}
            </Text>
          </View>
          <View style={{height: hp('1%')}}></View>

          <Divider style={{marginVertical: hp(1.5)}} />
          <View
            style={{
              width: wp('90%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginTop: wp(1.3),
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(3),
                color: '#AEC670',
                fontWeight: 'bold',
              }}>
              Total
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(3),
                color: '#AEC670',
                fontWeight: 'bold',
              }}>
              {detailsObj ? `${detailsObj.net_total} PKR` : null}
            </Text>
          </View>
          <View style={{height: hp('4%')}}></View>
          </ScrollView>
          </> */}
      </Animated.View>
      :
        null
      }
      
      {loader ? (
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('./../../assets/images/loader.gif')}
            style={{width: 200, height: 200}}
          />
        </View>
      ) : null}
    </>
 
  );
};
const NewOrder = ({ detailsObj,getOrders, orderItems,loader,setLoader,endUpActionSheet}) => {
 console.log('awdwad',orderItems)
   const [timeOfDelivery,setTimeOfDelivery] = useState('')
  const deliverOrderFunc = async () => {
  
     const res= await PutMethod(
       urlForSignUp,
       {
         order_status: 'Delivered',
         docstatus: true,
         delivery_date_time:timeOfDelivery
       },
       `resource/Sales Order/${(detailsObj)?detailsObj.name:null}`,
     )
     if (res.error !== undefined) {
       setLoader(false)
       Toast.show({
         type: 'error',
         position: "top",
         text1: `${res.error}👋`
       });
       
     }
     else {
       
       endUpActionSheet()
       getOrders()
     }
  }
  const setDeliveryTimeToEmployee = async () => {
    const getData = await GetItem('user');
    const getparseData = await JSON.parse(getData);
    var tzoffset = (new Date()).getTimezoneOffset() * 60000
    var time_stamp_date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
     setTimeOfDelivery(time_stamp_date)
     const res= await PutMethod(
       urlForSignUp,
       {
         last_order_date_time:time_stamp_date
       },
       `resource/Employee/${getparseData.employeeNumber}`,
     )
     if (res.error !== undefined) {
       setLoader(false)
       Toast.show({
         type: 'error',
         position: "top",
         text1: `${res.error}👋`
       });
       
     }
     else {
      deliverOrderFunc()
     }
  }
  const sendSalesInvoice = async () => {
       
  }
  return (

    <>{(detailsObj !== null && (detailsObj.order_status === "Rider Accepted" || detailsObj.order_status === "Preparing" || detailsObj.order_status === "Making" || detailsObj.order_status === "Baking" || detailsObj.order_status === "Ready")) ?
      <>
         <View style={{height: hp('4%')}}></View>
      

      <Text
        allowFontScaling={false}
        style={{
          fontFamily: 'Proxima Nova',
          fontSize: hp(2.5),
          color: 'black',
          fontWeight: 'bold',
          alignSelf: 'center',
        }}>
        Pick-Up Your Order
    </Text>
    
   
   
    <View style={{ height: hp('1%') }}></View>
    <Text
        allowFontScaling={false}
        style={{
          fontFamily: 'Proxima Nova',
          fontSize: hp(2),
          color: 'black',
          fontWeight: '600',
          alignSelf: 'center',
        }}>
      You have to pick-up this order asap! Drive Safe
      </Text>
          <View style={{ height: hp('4%') }}></View>
      <ScrollView>
        <View style={{width: wp('95%'), alignSelf: 'center'}}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.2),
              color: 'black',
              fontWeight: '700',
              marginLeft: hp(1),
            }}>
            Your route
          </Text>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{
              width: wp('90%'),
              height: hp('25%'),
              alignSelf: 'center',
              marginTop: hp(2),
              borderRadius: hp(5),
            }}
            region={{
              latitude: detailsObj ? detailsObj.lat : 0,
              longitude: detailsObj ? detailsObj.lng : 0,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
        >
          <MapViewDirections
            origin={{ latitude: 32.584, longitude: 71.537 }}
            destination={{ latitude:32.578, longitude:71.547 }}
        waypoints={[
          { latitude: 32.584, longitude: 71.537 }
        ]}
        apikey={'AIzaSyDZJsqUrsfEJVX0fGVJbjAmD1g64W6I3ZE'} // insert your API Key here
        strokeWidth={2.5}
        strokeColor={PRIMARY_GRADIENT_COLOR}
      />
        <Marker
            coordinate={{
                  latitude: 32.578,
                  longitude: 71.547,
              latitudeDelta:0.03,
              longitudeDelta:0.03
            }}
            image={require('./../../assets/images/home_marker1.png')}
            
          />
          <Marker
            coordinate={{
                  latitude: 32.584, longitude: 71.537,
              
              latitudeDelta:0.03,
              longitudeDelta:0.03
            }}
            image={require('./../../assets/images/rider_image.png')}
            
          />
          </MapView>
        </View>

        <View style={{height: hp('2%')}}></View>
        <Divider style={{marginVertical: hp(1.5)}} />
    

        <View style={{height: hp('1%')}}></View>
        <View style={{ width: wp('90%'), alignSelf: 'center',justifyContent:'space-between',flexDirection:'row'}}>
        <View style={{flexDirection:'row'}}>
          <Icon
            name='shop'
            type='entypo'
            color={'black'}
          />
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.2),
              color: 'black',
              fontWeight: '700',
              marginLeft: hp(1),
            }}>
            Pick-Up Location
          </Text>
        </View>
        <View style={{flexDirection:'row'}}>
        <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.2),
              color: 'black',
              fontWeight: '700',
              marginLeft: hp(1),
            }}>
            6 min,
          </Text>

          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.2),
              color: 'black',
              fontWeight: '700',
              marginLeft: hp(1),
            }}>
           2 Km
          </Text>
          </View>
      </View>
      <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '600',
              width: wp('88%'),
              alignSelf:'center'
            }}>
           {detailsObj ? `${detailsObj.branch}` : null}
          </Text>
        <Divider style={{marginVertical: hp(1.5)}} />

    
        <View style={{height: hp('1%')}}></View>
        <View style={{ width: wp('90%'), alignSelf: 'center',justifyContent:'space-between',flexDirection:'row'}}>
        <View style={{flexDirection:'row'}}>
          <Icon
            name='pizza'
            type='ionicon'
            color={'black'}
          />
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.2),
              color: 'black',
              fontWeight: '700',
              marginLeft: hp(1),
            }}>
            Ordered Items
          </Text>
        </View>
       </View>
    
        <View>
        {orderItems.length > 0 &&
            orderItems.map(item => {
              return (
                <View
                style={{
                  backgroundColor: 'white',
                  height: 'auto',
                  paddingVertical: hp(2),
                  width: wp('90%'),
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <FastImage
                    source={{
                      uri: `${baseUrlforImage}${item.image}`,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 60 / 2,
                      borderWidth: 2,
                      borderColor: SECONDARY_GRADIENT_COLOR,
                    }}
                    resizeMode="cover"
                  />
                  <View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2),
                        fontWeight: 'bold',
                        marginLeft: wp(3),
                        width: wp('40%'),
                        color:'black'
                      }}>
                      {item.item_code}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: wp('45%'),
                        marginLeft: wp(1),
                        marginTop: wp(1),
                      }}>
                      {item.topings !== null
                        ? item.topings.map((ite, index) => {
                            return (
                              <Text style={{marginLeft: hp(1), color: 'gray'}}>
                                {ite.name +
                                  ' (' +
                                  item.qty +
                                  ' x ' +
                                  ite.rate +
                                  ' PKR)'}
                                {item.topings.length - 1 === index ? null : ','}
                              </Text>
                            );
                          })
                        : null}
                    </View>
                  </View>
                </View>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2),
                    fontWeight: 'bold',
                    marginLeft: wp(3),
                    color:'black'
                  }}>
                  {item.qty} x {item.amount} PKR
                </Text>
              </View>
             )
           })
          }
        </View>
        <Divider style={{marginVertical: hp(1.5)}} />
        <View
          style={{
            width: wp('90%'),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'center',
            marginTop: wp(1.3),
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.7),
              color: '#AEC670',
              fontWeight: 'bold',
            }}>
            Amount Collection
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2.7),
              color: '#AEC670',
              fontWeight: 'bold',
            }}>
            {detailsObj ? `${detailsObj.net_total} PKR` : null}
          </Text>
      </View>
      
      <View style={{height: hp('2%')}}></View>
      <View>
      <SlideButton
          title="Pick Order"
          icon={<Icon name='doubleright' type='antdesign' />}
          height={54}
          borderRadius={27}
          width={wp('80%')}
          autoReset={true}
          underlayStyle={{backgroundColor:SECONDARY_GRADIENT_COLOR}}
          containerStyle={{backgroundColor:SECONDARY_GRADIENT_COLOR}}
          onReachedToEnd={async() => {
            setLoader(true)
            const res= await PutMethod(
              urlForSignUp,
              {
                order_status:'On The Way',
              },
              `resource/Sales Order/${(detailsObj)?detailsObj.name:null}`,
            )
            if (res.error !== undefined) {
              setLoader(false)
              Toast.show({
                type: 'error',
                position: "top",
                text1: `${res.error}👋`
              });
              
            }
            else {
              endUpActionSheet()
          
              getOrders()
            }
            // setTimeout(() => {
            //   setAnimating(false)
            // }, 5000)
          }}
          // reverseSlideEnabled
          reverseSlideEnabled
       
        />
      </View>

          <View style={{ height: hp('4%') }}></View>
         
    </ScrollView>
    <Pressable
                      style={({pressed}) => [
                        {
                          opacity: pressed ? 0.2 : 1,
                          width: wp('20%'),
                          borderRadius: wp(8),
                          paddingVertical: wp(1.5),
                          backgroundColor:'red',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'absolute',
                          right: wp(2),
                          top:wp(7)
                        },
                      ]}
                      onPress={() => {
                        // console.log('swqdqwd', JSON.stringify(item, null, 2));
                        // setDetailsObj(item);
                        // getItemsofOrder(item.name);
                        endUpActionSheet()
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'Proxima Nova',
                          fontSize: hp(2),
                          color: 'white',
                          fontWeight: '700',
                        }}>
                        Close
                      </Text>
                    </Pressable>
        </>
    :
      (detailsObj !== null && detailsObj.order_status === "On The Way") ?
      <>
      <View style={{height: hp('4%')}}></View>
   

   <Text
     allowFontScaling={false}
     style={{
       fontFamily: 'Proxima Nova',
       fontSize: hp(2.5),
       color: 'black',
       fontWeight: 'bold',
       alignSelf: 'center',
     }}>
     Deliver Your Order
 </Text>
 


 <View style={{ height: hp('1%') }}></View>
 <Text
     allowFontScaling={false}
     style={{
       fontFamily: 'Proxima Nova',
       fontSize: hp(2),
       color: 'black',
       fontWeight: '600',
       alignSelf: 'center',
     }}>
   You have to deliver this order asap! Drive Safe
   </Text>
       <View style={{ height: hp('4%') }}></View>
   <ScrollView>
     <View style={{width: wp('95%'), alignSelf: 'center'}}>
       <Text
         allowFontScaling={false}
         style={{
           fontFamily: 'Proxima Nova',
           fontSize: hp(2.2),
           color: 'black',
           fontWeight: '700',
           marginLeft: hp(1),
         }}>
         Your route
       </Text>
       <MapView
         provider={PROVIDER_GOOGLE} // remove if not using Google Maps
         style={{
           width: wp('90%'),
           height: hp('20%'),
           alignSelf: 'center',
           marginTop: hp(2),
           borderRadius: hp(5),
         }}
         region={{
           latitude: detailsObj ? detailsObj.lat : 0,
           longitude: detailsObj ? detailsObj.lng : 0,
           latitudeDelta: 0.03,
           longitudeDelta: 0.03,
         }}
     >
       <MapViewDirections
         origin={{ latitude: 24.8601, longitude: 67.0565 }}
         destination={{ latitude:24.9372, longitude:67.423 }}
     waypoints={[
       { latitude: 24.9281, longitude:67.0879}
     ]}
     apikey={'AIzaSyDZJsqUrsfEJVX0fGVJbjAmD1g64W6I3ZE'} // insert your API Key here
     strokeWidth={4}
     strokeColor="#111111"
   />
    
       </MapView>
     </View>

     <View style={{height: hp('2%')}}></View>
     <Divider style={{marginVertical: hp(1.5)}} />
 

     <View style={{height: hp('1%')}}></View>
     <View style={{ width: wp('90%'), alignSelf: 'center',justifyContent:'space-between',flexDirection:'row'}}>
          <View style={{flexDirection:'row'}}>
            <Icon
              name='home'
              type='entypo'
              color={'black'}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
              Delivery Location
            </Text>
          </View>
          <View style={{flexDirection:'row'}}>
          <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
              6 min,
            </Text>

            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2.2),
                color: 'black',
                fontWeight: '700',
                marginLeft: hp(1),
              }}>
             2 Km
            </Text>
            </View>
        </View>
        <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Proxima Nova',
                fontSize: hp(2),
                color: 'black',
                fontWeight: '600',
                width: wp('88%'),
                alignSelf:'center'
              }}>
             {detailsObj ? `${detailsObj?.shipping_address?.substring(0, detailsObj.shipping_address.indexOf('<'))}` : null}
            </Text>
     <Divider style={{marginVertical: hp(1.5)}} />

 
     <View style={{height: hp('1%')}}></View>
     <View style={{ width: wp('90%'), alignSelf: 'center',justifyContent:'space-between',flexDirection:'row'}}>
     <View style={{flexDirection:'row'}}>
       <Icon
         name='pizza'
         type='ionicon'
         color={'black'}
       />
       <Text
         allowFontScaling={false}
         style={{
           fontFamily: 'Proxima Nova',
           fontSize: hp(2.2),
           color: 'black',
           fontWeight: '700',
           marginLeft: hp(1),
         }}>
         Ordered Items
       </Text>
     </View>
    </View>
 
     <View>
     {orderItems.length > 0 &&
            orderItems.map(item => {
              return (
                <View
                style={{
                  backgroundColor: 'white',
                  height: 'auto',
                  paddingVertical: hp(2),
                  width: wp('90%'),
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <FastImage
                    source={{
                      uri: `${baseUrlforImage}${item.image}`,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 60 / 2,
                      borderWidth: 2,
                      borderColor: SECONDARY_GRADIENT_COLOR,
                    }}
                    resizeMode="cover"
                  />
                  <View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2),
                        fontWeight: 'bold',
                        marginLeft: wp(3),
                        width: wp('40%'),
                        color:'black'
                      }}>
                      {item.item_code}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: wp('45%'),
                        marginLeft: wp(1),
                        marginTop: wp(1),
                      }}>
                      {item.topings !== null
                        ? item.topings.map((ite, index) => {
                            return (
                              <Text style={{marginLeft: hp(1), color: 'gray'}}>
                                {ite.name +
                                  ' (' +
                                  item.qty +
                                  ' x ' +
                                  ite.rate +
                                  ' PKR)'}
                                {item.topings.length - 1 === index ? null : ','}
                              </Text>
                            );
                          })
                        : null}
                    </View>
                  </View>
                </View>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2),
                    fontWeight: 'bold',
                    marginLeft: wp(3),
                    color:'black'
                  }}>
                  {item.qty} x {item.amount} PKR
                </Text>
              </View>
             )
           })
          }
     </View>
     <Divider style={{marginVertical: hp(1.5)}} />
     <View
       style={{
         width: wp('90%'),
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignSelf: 'center',
         marginTop: wp(1.3),
       }}>
       <Text
         allowFontScaling={false}
         style={{
           fontFamily: 'Proxima Nova',
           fontSize: hp(2.7),
           color: '#AEC670',
           fontWeight: 'bold',
         }}>
         Amount Collection
       </Text>
       <Text
         allowFontScaling={false}
         style={{
           fontFamily: 'Proxima Nova',
           fontSize: hp(2.7),
           color: '#AEC670',
           fontWeight: 'bold',
         }}>
         {detailsObj ? `${detailsObj.net_total} PKR` : null}
       </Text>
   </View>
   
   <View style={{height: hp('2%')}}></View>
   <View>
   <SlideButton
       title="Deliver Order"
       icon={<Icon name='doubleright' type='antdesign' />}
       height={54}
       borderRadius={27}
       width={wp('80%')}
       autoReset={true}
       underlayStyle={{backgroundColor:SECONDARY_GRADIENT_COLOR}}
       containerStyle={{backgroundColor:SECONDARY_GRADIENT_COLOR}}
       onReachedToEnd={async() => {
         setLoader(true)
        await deliverOrderFunc()
         // setTimeout(() => {
         //   setAnimating(false)
         // }, 5000)
       }}
       // reverseSlideEnabled
       reverseSlideEnabled
    
     />
   </View>

       <View style={{ height: hp('4%') }}></View>
      
 </ScrollView>
 <Pressable
                   style={({pressed}) => [
                     {
                       opacity: pressed ? 0.2 : 1,
                       width: wp('20%'),
                       borderRadius: wp(8),
                       paddingVertical: wp(1.5),
                       backgroundColor:'red',
                       alignItems: 'center',
                       justifyContent: 'center',
                       position: 'absolute',
                       right: wp(2),
                       top:wp(7)
                     },
                   ]}
                   onPress={() => {
                     // console.log('swqdqwd', JSON.stringify(item, null, 2));
                     // setDetailsObj(item);
                     // getItemsofOrder(item.name);
                     endUpActionSheet()
                     
                   }}>
                   <Text
                     allowFontScaling={false}
                     style={{
                       fontFamily: 'Proxima Nova',
                       fontSize: hp(2),
                       color: 'white',
                       fontWeight: '700',
                     }}>
                     Close
                   </Text>
                 </Pressable>
     </>   
      :
        (detailsObj !== null && (detailsObj.order_status === "Delivered" || detailsObj.order_status === "Cancelled")) ?
       <>
        <View style={{height: hp('4%')}}></View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: wp('95%'),
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              fontWeight: 'bold',
              marginLeft: wp(4),
            }}>
            Ordered Details
          </Text>
          <Icon
            name="close"
            type="antdesign"
            size={wp(7)}
            color="black"
            containerStyle={{alignSelf: 'center'}}
            onPress={() => endUpActionSheet()}
          />
        </View>
        <View style={{height: hp('4%')}}></View>

        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(2.5),
            color: 'black',
            fontWeight: '700',
            marginLeft: hp(1),
            alignSelf: 'center',
          }}>
          Order Id #{' '}
          {detailsObj
            ? detailsObj.name.substring(8, detailsObj.name.length)
            : null}
        </Text>

        <View style={{ height: hp('2%') }}></View>
        <ScrollView>
        <View style={{width: wp('95%'), alignSelf: 'center'}}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '700',
              marginLeft: hp(1),
            }}>
            Delivery Address
          </Text>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{
              width: wp('90%'),
              height: hp('20%'),
              alignSelf: 'center',
              marginTop: hp(2),
              borderRadius: hp(5),
            }}
            region={{
              latitude: detailsObj ? detailsObj.lat : 0,
              longitude: detailsObj ? detailsObj.lng : 0,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
            liteMode={true}>
            <Marker
              coordinate={{
                latitude: detailsObj ? detailsObj.lat : 0,
                longitude: detailsObj ? detailsObj.lng : 0,
              }}>
              <Icon
                name="location"
                type="ionicon"
                color={SECONDARY_GRADIENT_COLOR}
                size={hp(5)}
              />
            </Marker>
          </MapView>
        </View>

        <View style={{height: hp('2%')}}></View>
        <Divider style={{ marginVertical: hp(1.5) }} />
        <View style={{width: wp('95%'), alignSelf: 'center'}}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '700',
              marginLeft: hp(1),
            }}>
            Ordered Items
          </Text>
        </View>
        <View>
          {orderItems.length > 0 &&
            orderItems.map(item => {
              return (
                <View
                style={{
                  backgroundColor: 'white',
                  height: 'auto',
                  paddingVertical: hp(2),
                  width: wp('90%'),
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <FastImage
                    source={{
                      uri: `${baseUrlforImage}${item.image}`,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 60 / 2,
                      borderWidth: 2,
                      borderColor: SECONDARY_GRADIENT_COLOR,
                    }}
                    resizeMode="cover"
                  />
                  <View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontFamily: 'Proxima Nova',
                        fontSize: hp(2),
                        fontWeight: 'bold',
                        marginLeft: wp(3),
                        width: wp('40%'),
                        color:'black'
                      }}>
                      {item.item_code}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: wp('45%'),
                        marginLeft: wp(1),
                        marginTop: wp(1),
                      }}>
                      {item.topings !== null
                        ? item.topings.map((ite, index) => {
                            return (
                              <Text style={{marginLeft: hp(1), color: 'gray'}}>
                                {ite.name +
                                  ' (' +
                                  item.qty +
                                  ' x ' +
                                  ite.rate +
                                  ' PKR)'}
                                {item.topings.length - 1 === index ? null : ','}
                              </Text>
                            );
                          })
                        : null}
                    </View>
                  </View>
                </View>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Proxima Nova',
                    fontSize: hp(2),
                    fontWeight: 'bold',
                    marginLeft: wp(3),
                    color:'black'
                  }}>
                  {item.qty} x {item.amount} PKR
                </Text>
              </View>
             )
           })
          }
        </View>
  
        <View style={{height: hp('1%')}}></View>

        <Divider style={{ marginVertical: hp(1.5) }} />
        <View style={{width:wp('90%'),flexDirection:'row',justifyContent:'space-between',alignSelf:'center'}}>
        <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '700',
        
            }}>
             Sub-Total
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '700',
              
            }}>
           {detailsObj
            ? `${detailsObj.net_total} PKR`
            : null}
          </Text>
        </View>
        <View style={{width:wp('90%'),flexDirection:'row',justifyContent:'space-between',alignSelf:'center',             marginTop:wp(1.3)
}}>
        <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '600',
            }}>
             Delivery Charges
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '600',
       
            }}>
           {detailsObj
            ? `${0} PKR`
            : null}
          </Text>
        </View>
        <View style={{width:wp('90%'),flexDirection:'row',justifyContent:'space-between',alignSelf:'center',             marginTop:wp(1.3)
}}>
        <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '600',
            }}>
             GST TAX
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(2),
              color: 'black',
              fontWeight: '600',
            }}>
           {detailsObj
            ? `${0} PKR`
            : null}
          </Text>
        </View>
        <View style={{height: hp('1%')}}></View>

        <Divider style={{ marginVertical: hp(1.5) }} />
        <View style={{width:wp('90%'),flexDirection:'row',justifyContent:'space-between',alignSelf:'center',             marginTop:wp(1.3)
}}>
        <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              color: "#AEC670",
              fontWeight: 'bold',
            }}>
             Total
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Proxima Nova',
              fontSize: hp(3),
              color: "#AEC670",
              fontWeight: 'bold',
            }}>
             {detailsObj
            ? `${detailsObj.net_total} PKR`
            : null}
          </Text>
          </View>
          <View style={{ height: hp('4%') }}></View>
        </ScrollView>
          </>
          :
          null
  }</>
)
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  logoImageSize: {
    width: 130,
    height: 130,
    alignSelf: 'center',
  },
});

export default MyOrders;
