import React,{useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  BACKGROUND_COLOR,
  PRIMARY_GRADIENT_COLOR,
  SECONDARY_GRADIENT_COLOR,
} from '../../assets/colors';
import {LOGO} from '../../assets/imageConstant';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import {Input, Icon} from '@rneui/base';
import PostMethod from '../../NetworkCalls/post';
import GetMethod from '../../NetworkCalls/get'
import {urlForSignUp} from '../../constant/baseurl'
import { StoreItem } from '../../asyncstorage/function';

const LoginScreen = (props) => {
  const [passwordSecureEntry, setPasswordSecureEntry] = useState(true);
  const [eemail, seteEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader,setLoader] = useState(false)
  const signIn = async()=>{
    if(eemail === '' || password === ''){
      Toast.show({
        type: 'error',
        position:"top",
        text1: `${'Fill all values'}👋`,
      });
    }
    else{
      setLoader(true)
      const res= await PostMethod(
        urlForSignUp,
        {
          usr: eemail,
          pwd: password,
        },
        'method/login',
      )
      console.log('dewfewf',res)
        if(res.error !== undefined){
          setLoader(false)
          Toast.show({
            type: 'error',
            position:"top",
            text1: `${res.error}👋`
          });
        
        }
        else{
          const request = await GetMethod(`${urlForSignUp}`,undefined,`resource/User/${eemail}`)
          const dataparse = await request.json()
          const array = dataparse.data.roles.filter(item => {
            return item.role === "Rider"
          })
          if (dataparse.data.enabled === 0) {
            Toast.show({
              type: 'error',
              position:"top",
              text1: `${"You are not a active user"}👋`
            });
          }
          else {
            if (array.length > 0) {
              const req = await GetMethod(`${urlForSignUp}`,undefined,`resource/Employee?fields=["*"]&filters={"user_id":"${eemail}"}`)
              const datapar = await req.json()
              console.log('wdwqdqw',JSON.stringify(datapar,null,2))
              await StoreItem('user',{
                name:dataparse.data.full_name,
                email: eemail,
                employeeNumber:datapar.data[0].employee
              })
              props.navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              })
                  setLoader(false) 
            }
            else {
              setLoader(false)
              Toast.show({
                type: 'error',
                position:"top",
                text1: `${"Your role is not a rider role"}👋`
              });
            }
          }
         
        
     
         
          }
        }
    }
  
    
  
  return (
    <>
      <Image
        source={require('./../../assets/images/Vector.png')}
        style={{
          width: wp('100%'),
          height: hp('55%'),
          position: 'absolute',
          top: wp(-23),
          opacity: 0.2,
          shadowOpacity: 0.1,
        }}
      />
      <LinearGradient
        colors={['white', '#ffffff00']}
        style={{
          width: wp('100%'),
          height: hp('28%'),
          position: 'absolute',
          top: wp(45),
          opacity: 0.5,
        }}></LinearGradient>
      <View style={styles.container}>
      <View style={{ height: hp('7%') }} />
      <View
          style={{
            width: wp('40%'),
            height: wp('40%'),
            borderRadius: wp('40%') / 2,
            alignSelf: 'center',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            shadowOpacity: 0.48,
            shadowRadius: 11.95,
            elevation: 6,
        }}
        >
        <Image
          source={require('./../../assets/images/rider_image.png')}
          style={styles.logoImageSize}
          />
          </View>
        <View style={{ height: hp('3%') }} />
       
        <View
          style={{flexDirection: 'row', marginTop: wp(2), alignSelf: 'center'}}>
          <Text
            style={{
              fontSize: hp(3.5),
              color: PRIMARY_GRADIENT_COLOR,
              fontFamily: 'Viga-Regular',
              fontWeight:'bold'
            }}>
            Sowaan
          </Text>
          <Text
            style={{
              fontSize: hp(3.5),
              color: SECONDARY_GRADIENT_COLOR,
              fontFamily: 'Viga-Regular',
              fontWeight:'bold'
            }}>
            ERP Rider App
          </Text>
        </View>
        <View style={{height: hp('3%')}} />

        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Proxima Nova',
            fontSize: hp(3.5),
            color: 'black',
            fontWeight: '700',
            textAlign: 'center',
            width: wp('90%'),
            alignSelf: 'center',
          }}>
          Login to your account
        </Text>
        <Input
            allowFontScaling={false}
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={text => seteEmail(text)}
            containerStyle={{width: wp('88%'), alignSelf: 'center',marginTop:widthPercentageToDP(10)}}
            inputContainerStyle={{
              borderRadius: 8,
              borderColor: '#F4F4F4',
              borderWidth: 2,
              paddingLeft: 10,
              fontSize: hp(2.2),
              marginTop: hp(-1.5),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.48,
              shadowRadius: 11.95,
              elevation: 2,
            }}
            inputStyle={{
              fontSize: hp(2.3),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
            }}
        
            leftIcon={
              <Icon
                name="email"
                type="material"
                color={SECONDARY_GRADIENT_COLOR}
                size={wp(5)}
              />
            }
          />
          <Input
            allowFontScaling={false}
            placeholder="Password"
            secureTextEntry={passwordSecureEntry}
            containerStyle={{width: wp('88%'), alignSelf: 'center'}}
            inputContainerStyle={{
              borderRadius: 8,
              borderColor: '#F4F4F4',
              borderWidth: 2,
              paddingLeft: 10,
              fontSize: hp(2.2),
              marginTop: hp(-1.5),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.48,
              shadowRadius: 11.95,
              elevation: 2,
            }}
            inputStyle={{
              fontSize: hp(2.3),
              color: '#3B3B3B',
              fontFamily: 'Proxima Nova',
            }}
            leftIcon={
              <Icon
                name="lock"
                type="material"
                color={SECONDARY_GRADIENT_COLOR}
                size={wp(5)}
              />
            }
            onChangeText={text => setPassword(text)}

            rightIcon={
              <>
                {passwordSecureEntry ? (
                  <Icon
                    name="eye"
                    type="font-awesome-5"
                    color={SECONDARY_GRADIENT_COLOR}
                    size={wp(5)}
                    onPress={() => setPasswordSecureEntry(false)}
                  />
                ) : (
                  <Icon
                    name="eye-slash"
                    type="font-awesome-5"
                    color={SECONDARY_GRADIENT_COLOR}
                    size={wp(5)}
                    onPress={() => setPasswordSecureEntry(true)}
                  />
                )}
              </>
            }
            rightIconContainerStyle={{marginRight: hp(1)}}
          />
       
      
        <TouchableOpacity
                                onPress={()=>signIn()}

        >
          <LinearGradient
            colors={[PRIMARY_GRADIENT_COLOR, SECONDARY_GRADIENT_COLOR]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{
              width: wp('45%'),
              height: hp('7%'),
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: hp(3),
            }}>
            <Text
              allowFontScaling={false}
              style={{
                color: 'white',
                fontSize: hp(2.5),
                fontFamily: 'Proxima Nova',
                fontWeight:'700'
              }}>
              Login
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {(loader)?
            <View style={{backgroundColor:'rgba(255,255,255,0.6)',position:'absolute',top:0,bottom:0,left:0,right:0,alignItems:'center',justifyContent:'center'}}>
            <Image source={require('./../../assets/images/loader.gif')} style={{width:200,height:200}}/>
          </View>
          :
          null
      }
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  logoImageSize: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
});
export default LoginScreen;
