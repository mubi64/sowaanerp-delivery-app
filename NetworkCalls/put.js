const PutMethod=async(BaseUrl,requestData,routeName)=>{
    try {
        let response = await fetch(`${BaseUrl}${routeName}`,{
                    method:"PUT",
                    headers: {
                       'Content-Type': 'application/json;charset=UTF-8',
                       "Access-Control-Allow-Origin": "*",
                   },
                    body:JSON.stringify(requestData)
                })
        if (response.status === 200) {
            let data = await response.json();
            // setUsers(data);
            return data
        } else {
            let error = await response.json()
            if(error.message!==undefined){
                throw error.message
            }
            else{
                const firstJSON = await eval(error._server_messages)
                console.log('wdwd',firstJSON)
                const secondJSON = await JSON.parse(firstJSON)
                throw secondJSON.message
            }
        }
    } catch (error) {
        console.log('dwdwad',error)
         return {
            error:error
         }
    }
    //     const res = await fetch(`${BaseUrl}${routeName}`,{
    //         method:"POST",
    //         headers: {
    //            'Content-Type': 'application/json;charset=UTF-8',
    //            "Access-Control-Allow-Origin": "*",
    //        },
    //         body:JSON.stringify(requestData)
    //     }).catch(err=>{
    //         console.log('dawdad',err)
    //         return err
    //     }).then(data=>{
    //         return data
    //     })
     
    //   return res
    
    

}
export default PutMethod