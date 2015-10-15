var roleModel = {
    roleName: {
        validators:[{
            required: true, message: "No role name"
        }]
    }
};

var usermodel = {
    userName: {
        validators: [{
            required: true, message:"Required name"
        }, {
            regular: /asd/, message: "Not valid regular"
        }]
    },
    role: {
        validators: [{
          required: true, message:"no role :("
        }],
        embeded: roleModel
    }
}


var modelBuilder = function(modelDefinition){


    model.validators = [];
    Object(modelDefinition).keys.forEach(function(field){



        if(modelDefinition[field].validators){
            modelDefinition[field].validators.forEach(function(validator){
                model.validators.push({fieldName: field, validator: validatorBuilder(validator)});
            })


        }



    });




}