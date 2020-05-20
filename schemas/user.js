exports.login = {
  type: "object",
  properties: {
    username: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
};

exports.register = {
  type: "object",
  properties: {
    username: {
      type: "string",
      minLenght: 6,
      maxLenght: 20,
      required: true,
    },
    password: {
      type: "string",
      minLenght: 6,
      maxLenght: 20,
      required: true,
    },
    name: {
      type: "string",
      required: false,
    }
  }
};