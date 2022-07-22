var img = new Image();
img.src = "https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/553ba68d1ef0cea18239311bfab78639da181fb9.png";
img.src = "https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/1f783802ab981e589c80e6737dad54073b91bbce.png";

var page = 0;
var count = 1;
var is_fin = 0;
get_reply()

function reply_send() {
    if(is_fin == 0) {
        var in_date = document.getElementById("input_date").value;
        var in_address = document.getElementById("input_address").value;
        var in_name = document.getElementById("input_name").value;
        var in_why = document.getElementById("input_why").value;
        if(in_date == "" || in_address == "" || in_name == "" || in_why == "") {
            alert("输入框不能为空！");
            return;
        }
        if(in_date.length > 20 || in_address.length > 20 || in_name.length > 20 || in_why.length > 30) {
            alert("输入字符过多")
            return;
        }
        httpGetAsync("/otenki-girl/sendreply?name=" + in_name + "&date=" + in_date + "&address=" + in_address + "&why=" + in_why, function back(text) {
            document.getElementById("main").style.backgroundImage = "url(https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/553ba68d1ef0cea18239311bfab78639da181fb9.png)";
            document.getElementById("coin").style.visibility = "visible";
            anime({
                targets: document.getElementById("coin"),
                translateY: -100,
                duration: 1500,
                easing: 'easeOutCubic',
                complete: function() {
                    document.getElementById("coin").style.visibility = "hidden";
                    document.getElementById("main").style.backgroundImage = "url(https://images.weserv.nl/?url=https://article.biliimg.com/bfs/article/7692cb2844bdcb6d0dbd0f9954c7192f1b75d99d.png)";
                }
            });
            get_reply()
            document.getElementById("input_date").value = ""
            document.getElementById("input_address").value = ""
            document.getElementById("input_name").value = ""
            document.getElementById("input_why").value = ""
        })
        is_fin = 1;
    } else {
        alert("请勿频繁提交");
    }
}

function get_reply() {
    httpGetAsync("/otenki-girl/getreply?page=" + page, function back(text) {
        reply_json = JSON.parse(text)
        reply_list = reply_json["Data"];
        html_txt = "";
        for(var i = 0; i < reply_list.length; i++) {
            html_txt += "<div class=\"reply\">\
                <div class=\"reply_name\">\
                    " + reply_list[i]["Name"] + ":\
                </div>\
                <div id=\"reply_why_1\" class=\"reply_why\">\
                    " + reply_list[i]["Why"] + "\
                </div>\
                <div id=\"reply_date_1\" class=\"reply_date\">\
                    在" + reply_list[i]["Date"] + "，希望" + reply_list[i]["Address"] + "天晴，发送于" + 
                    dateFormat("YYYY年mm月dd日 HH:MM:SS", new Date(parseInt(reply_list[i]["Times"]) * 1000)) + "\
                </div>\
            </div>"
        }
        count = Math.ceil(reply_json["Message"] / 10)
        document.getElementById("replys").innerHTML = html_txt
        document.getElementById("reply_page").innerHTML = "第" + (page+1) + "页 / 共" + count + "页"
    })
}

function page_change_1() {
    if(page != 0) {
        page -= 1
        get_reply()
    } else {
        alert("已经是第一页了！")
    }
}

function page_change_2() {
    if(page != count - 1) {
        page += 1
        get_reply()
    } else {
        alert("已经是最后一页了！")
    }
}

function dateFormat(fmt, date) {
    let ret;
    let opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
