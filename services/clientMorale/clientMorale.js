/**
 * Created by vaio on 23.09.2015.
 */
var db = require('../common/dbConnection/orientDB');
var mbClient = require("../common/mbConnection/netConnection");
var resultFactory = require("../common/operations/resultFactory");
var sqlBuilder = require("../common/sql/sqlBuilder");

var clientMoraleModel = require("./dataLayer/models/clientMorale");
var linkModel = require("./dataLayer/links/client_to_period");



var client = mbClient(function (isReconnecting) {

    //CREATE CLIENTMORALE
    client.registerRoute('/clientMorale/create', function (request) {

        if(!request.payload.period){
            return request.sendResponse(resultFactory.internalError(["#period not found"]))
        }

        var newClientMorale = clientMoraleModel.create();
        newClientMorale.update(request.payload);

        newClientMorale.validate().then(function () {
            if (newClientMorale.isValid) {
                db.create('VERTEX', 'clientMorale')
                    .set(newClientMorale.attrs)
                    .one()
                    .then(function (vertex) {

                        var newLink = linkModel.create();

                        newLink.validate().then(function() {
                            if (newLink.isValid) {
                                db.create('EDGE', 'client_to_period')
                                    .from(vertex['@rid'])
                                    .to(request.payload.period)
                                    .set(newLink.attrs)
                                    .one()
                                    .then(function (edge) {
                                        request.sendResponse(resultFactory.success(vertex['@rid']));
                                    });
                            } else {
                                request.sendResponse(resultFactory.validationError(newLink.errors));
                            }
                        });

                    });
            } else {
                request.sendResponse(resultFactory.validationError(newClientMorale.errors));
            }
        });
    });

    //SEARCH BY KEY
    client.registerRoute('/clientMorale/searchByKey', function (request) {

        db.query(sqlBuilder(
            'select @rid, organizationName, addressText, IINBIN, accountNumber from ' +
                '(select from ' +
                    '(traverse in("client_to_period") from ' +
                        '(select from period where period=:period)' +
                    ') where @class="clientMorale"' +
                ') ' +
            'where isDeleted=false and (organizationName like "%@key%" or addressText like "%@key%" or IINBIN like "%@key%" or rnn like "%@key%" or accountNumber like "%@key%")',
            [{key: "key", value: request.payload.searchKey},{key: "period", value: request.payload.period}]
        )).then(function (result) {
            request.sendResponse(resultFactory.success(result.map(function(item){
                return {
                    rid: item.rid,
                    organizationName: item.organizationName,
                    addressText: item.addressText,
                    IINBIN: item.IINBIN,
                    accountNumber: item.accountNumber
                }
            })));
        });
    });

    //GET BY ID
    client.registerRoute("/clientMorale/getById", function (request) {
        db.query('select from clientMorale where @rid=:rid and isDeleted=false', {
            params: {
                rid: request.payload
            },
            limit: 1
        }).then(function (result) {
            request.sendResponse(resultFactory.success(result.map(function(item){
                return {
                    rid: item.rid,
                    organizationName: item.organizationName,
                    addressText: item.addressText,
                    IINBIN: item.IINBIN,
                    accountNumber: item.accountNumber,
                    rnn: item.rnn
                }
            })));
        });

    });

    client.registerService();
});