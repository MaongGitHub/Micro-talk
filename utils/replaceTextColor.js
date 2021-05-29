function allfunctions() {
    //获取文字内容接口
let lovetext = new Promise((resolve, reject) => {
    $.ajax({
        url: 'https://api.vvhan.com/api/love?type=json',
        type: 'GET',
        async: true,
        data: 'type=json',
        success: function (love) {
            resolve(love.ishan);
            console.log(love.ishan);
        }, error: function (res) {
            reject(res);
        }
    })
});
//获取颜色属性接口
let fontscolor = new Promise((resolve, reject) => {
    $.ajax({
        url: 'https://api.vvhan.com/api/color?type=light',
        type: "GET",
        async: true,
        data: "type=json",
        dataType: "text",
        success: function (color) {
            resolve(color);
            console.log(color);
        },
        error: function (res) {
            reject(res);
        }
    })
});

//同时调用两个api接口，两者都为成功才能使用（并行顺序：先换文字后换颜色）
Promise.all([lovetext, fontscolor]).then((results) => {
    showTextAndColor(results);
    console.log(results);
});

//更换字体和颜色的函数
function showTextAndColor(res) {
    //换字
    $(".love").children().text(res[0]);
    //换色
    $(".fonts").attr("style", `color:${res[1]};font-size:20px;`);
}
}
