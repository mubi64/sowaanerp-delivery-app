const GetMethod = async (BaseUrl, requestData, routeName) => {
  try {
   
    var response = await fetch(
      requestData
        ? `${BaseUrl}${routeName}${requestData}`
        : `${BaseUrl}${routeName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
        credentials: 'include',
      },
    );
    return response;
  } catch (e) {
    console.log(e);
  }
};
export default GetMethod;
