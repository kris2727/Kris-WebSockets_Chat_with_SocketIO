exports.handler = async (event) => {
    // TODO implement
    var word = event.queryStringParameters.text;
    const response = {
        statusCode: 200,
        body: JSON.stringify('Kris-Reddivari says  -- '+word),
    };
    return response;
};
