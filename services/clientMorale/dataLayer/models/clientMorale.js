/**
 * Created by vaio on 23.09.2015.
 */
var modelCreator = require("../../../common/models/modelCreator");
module.exports = modelCreator("clientMorale", [
    {
        name: "IINBIN",
        properties: {
            validations: {
                presence: {
                    message: '#IINBIN is required!'
                }
            }
        }
    },
    {
        name: "addressText",
        properties: {
            validations: {
                presence: {
                    message: '#addressText is required!'
                }
            }
        }
    },
    {
        name: "organizationName",
        properties: {
            validations: {
                presence: {
                    message: '#organizationName is required!'
                }
            }
        }
    },
    {
        name: "rnn",
        properties: {
            validations: {
                presence: {
                    message: '#rnn is required!'
                }
            }
        }
    },
    {
        name: "accountNumber",
        properties: {
            validations: {
                presence: {
                    message: '#accountNumber is required!'
                }
            }
        }
    },

]);