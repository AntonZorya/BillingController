/**
 * Created by mac on 24.09.15.
 */
module.exports = function (sql, params) {
    if (params)
        params.forEach(function (item) {
            sql = sql.replace(new RegExp(":" + item.key, 'g'), itemValueBuilder(item.value, true));
            sql = sql.replace(new RegExp("@" + item.key, 'g'), itemValueBuilder(item.value, false));
        });
    console.log(sql);
    return sql;
};

var itemValueBuilder = function (value, quot) {
    if (typeof value == "string") {
        var s = value.replace(/\\/g, "\\\\");
        s = s.replace(/'/g, "\\\'");
        s = s.replace(/"/g, "\\\"");
        if (quot) return "\"" + s + "\"";
        else return s;
    } else return value;
};