/**
 * Created by mac on 24.09.15.
 */
module.exports = function(sql, params){
    if(params)
    params.forEach(function(item){
       sql = sql.replace(":"+item.key, itemValueBuilder(item.value));
        sql = sql.replace("@"+item.key, item.value);
    });

    return sql;
}

var itemValueBuilder = function(value) {
    if (typeof value == "string") {
        var s = value.replace(/"/g, "\\\"");
        s = s.replace(/'/g, "\\\'");
        return "\"" + s + "\"";
    } else return value;
}