'use strict';

function request(url,type,data,dataType,success_fn,error_fn) {
    $.ajax({
        url:url,
        type:type,
        async:true,
        data:data,
        dataType:dataType,
        success:function (res) {
            success_fn(res);
        },
        error:function (msg) {
            error_fn(msg);
        }
    })
}