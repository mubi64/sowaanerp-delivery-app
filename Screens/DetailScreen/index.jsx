import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

function DetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {obj} = route.params;
  return (
    <View style={{alignItems: 'center'}}>
      <View style={styles.mainCardView}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.subCardView}>
            {/* <Image
                source={Images.logo}
                resizeMode="contain"
                style={{
                  borderRadius: 25,
                  height: 50,
                  width: 50,
                }}
              /> */}
          </View>
          <View style={{marginLeft: 12}}>
            <Text
              style={{
                fontSize: 14,
                color: 'black',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}>
              Jack Dorsey
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View
            style={{
              height: 25,
              backgroundColor: 'black',
              borderWidth: 0,
              width: 25,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              margin: 2,
            }}>
            <Text style={{color: 'white'}}>i</Text>
          </View>

          <View
            style={{
              height: 25,
              backgroundColor: 'red',
              borderWidth: 0,
              width: 25,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              margin: 2,
            }}>
            <Text style={{color: 'white'}}>i</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text>sdf</Text>
        <Text>sdf</Text>
      </View>
      <Text>{obj.id}</Text>
      <Button title="Go to Home" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainCardView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16,
  },
  subCardView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'black',
    borderColor: '#eeeeee',
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
