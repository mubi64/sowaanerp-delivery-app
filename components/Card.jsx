import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function Card({children, obj}) {
  return (
    // <TouchableWithoutFeedback style={styles.container}>
    <View style={styles.mainCardView}>
      <View style={styles.subCardView}>
        <View>
          <View
            style={[
              styles.list,
              {justifyContent: 'space-between', width: '83%'},
            ]}>
            <View>
              <Text style={styles.bolder}>Order {obj.id}</Text>
            </View>
            <View>
              <Text style={styles.text}>{obj.date}</Text>
            </View>
          </View>
          <View style={styles.list}>
            <Text style={styles.bold}>Name: </Text>
            <Text style={styles.text}>jhon deo</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.bold}>Pickup Time: </Text>
            <Text style={styles.text}>23-11-2020 11:30 am</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.bold}>Pickup Location: </Text>
            <Text style={[styles.text]}>Some Location hear ...</Text>
          </View>
        </View>
      </View>
      <View style={[styles.flexView, {marginTop: 10, marginBottom: 4}]}>
        {children}
      </View>
    </View>

    // </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  mainCardView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 6,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginVertical: 6,
    overflow: 'hidden',
  },
  subCardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  bold: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  bolder: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  text: {
    color: 'gray',
    fontSize: 12,
    flexShrink: 1,
  },
});
