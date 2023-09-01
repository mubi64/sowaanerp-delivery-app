import AsyncStorage from '@react-native-async-storage/async-storage'



export const GetItem = async(key)=>{

  var getValue= await AsyncStorage.getItem('@'+key).then(success=>{
    return success
  }).catch(err=>{
   return err
  })
  return getValue

  // try {
  //   console.log(key)
  //   const value = await AsyncStorage.getItem(`@${key}`)
  //   if(value !== null) {
  //     var abc=JSON.parse(value)

  //     // value previously stored
  //     console.log("orderdata",abc)
  //   }
  // } catch(e) {
  //   // error reading value
  //   console.log("error",e)

  // }
}
export const DeleteItem = async(key)=>{
  var getValue= await AsyncStorage.removeItem('@'+key).then(success=>{
    //console.log("DELETE")
    return success
  }).catch(err=>{
   return err
  })
  return getValue
}

export const StoreItem = async(key,value)=>{
    if(typeof value === "string"){
        try {
            await AsyncStorage.setItem(`@${key}`, value)
          } catch (e) {
          }
    }
    else{
      try {

        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(`@${key}`, jsonValue)
      } catch (e) {
        console.log("Async Error ",e);
      }
    }
    
}