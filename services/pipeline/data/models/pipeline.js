var modelCreator = commonRequire('models/modelCreator');
module.exports = modelCreator('user', [
    {
        name: 'number',
        properties: {
            validations: {
                presence: {
                    message: '#pipelineNumber is required!'
                }
            }
        }
    }, {
        name: 'description'
    },
    {
        name: 'createDate',
        properties: {
            validations: {
                presence: {
                    message: '#pipelineCreateDate is required!'
                }
            }
        }
    },
    {
        name: 'isActive'
    },
    {
        name: 'waterPercent',
        properties: {
            validations: {
                presence: {
                    message: '#pipelineWeatherPercent is required!'
                }
            }
        }
    },
    {
        name: 'canalPercent',
        properties: {
            validations: {
                presence: {
                    message: '#pipelineCanalPercent is required!'
                }
            }
        }
    }
]);