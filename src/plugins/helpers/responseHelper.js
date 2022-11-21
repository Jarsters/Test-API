const responseHelper = (h, status, message, code, data = '') => {
  const response = h
    .response({
      status,
      message,
    })
    .code(code);
  if (Boolean(data)) {
    response.source.data = data;
  }
  return response;
};

module.exports = responseHelper;
