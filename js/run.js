window.onload = function () {
    let script_element = document.createElement("script");
    script_element.setAttribute("type", "text/javascript");
    // script_element.setAttribute("src", "https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js");
    document.body.appendChild(script_element);

    let showIcon = document.createElement("div");
    showIcon.id = "sogouTranslateShowIcon";
    showIcon.innerHTML = "译";
    showIcon.style.display = 'none';
    document.body.appendChild(showIcon);

    let translateDiv = document.createElement("div");
    translateDiv.id = "sogouTranslateDiv";
    document.body.appendChild(translateDiv);

    let translateText;
    let srcLanguage = "en";

    function selectText() {
        if (document.selection) {//For ie
            return document.selection.createRange().text;
        } else {
            return window.getSelection().toString();
        }
    }

    document.onmouseup = function (ev) {
        ev = ev || window.event;
        let left = ev.clientX, top = ev.clientY;
        setTimeout(function () {
            translateText = selectText();
            if (translateText.length > 0) {
                setTimeout(function () {
                    showIcon.style.display = 'block';
                    showIcon.style.left = left + 'px';
                    showIcon.style.top = top + 'px';
                }, 100);
            }
        }, 200);
    };

    function strToJson(str) {
        try {
            return (new Function("return " + str))();
        } catch (e) {
        }
        return str;
    }

    // 跨域
    function getHttpObj() {
        let httpobj = null;
        try {
            httpobj = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                httpobj = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e1) {
                httpobj = new XMLHttpRequest();
            }
        }
        return httpobj;
    }

    // 获取源语言
    function detectlanguage(src, data) {
        let detectlanguageKey = "xxx";
        // send
        let xhr = getHttpObj();
        xhr.open("post", "https://ws.detectlanguage.com/0.2/detect", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function () {
            let d = strToJson(xhr.responseText);
            console.log("d");
            console.log(d);
            if (xhr.readyState === 4 && xhr.status === 200) {
                let langu = d.data.detections[0].language;
                console.log("langu");
                console.log(langu);
                if (langu !== undefined) {
                    if (langu === "zh") {
                        return false;
                    } else {
                        srcLanguage = langu;
                    }
                }
                console.log("srcLanguage");
                console.log(srcLanguage);
                data = data.replace("{{srcLanguage}}", srcLanguage);
                translate(data)
            }
        };
        xhr.send("q=" + src + "&key=" + detectlanguageKey);
    }

    function translate(data) {
        let div = `
            <div style="margin: 3px">
                <span style="color: darkturquoise">Source Language:</span>
                <span>{{language}}</span>
            </div>
            <div style="margin: 3px">
                <span style="color: blueviolet">src:</span>
                <span>{{src}}</span>
            </div>
            <div style="margin: 3px">
                <span style="color: seagreen">translate:</span>
                <span>{{translate}}</span>
            </div>
        `;
        // send
        let xhr = getHttpObj();
        // xhr.open("post", "https://fanyi-api.baidu.com/api/trans/vip/translate", true);
        xhr.open("post", "https://fanyi.sogou.com/reventondc/api/sogouTranslate", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function () {
            let d = strToJson(xhr.responseText);
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (d.query === undefined) {
                    if (d.errorCode === undefined) {
                        div = "Error:" + d + ", See <a href='http://deepi.sogou.com/docs/fanyiDoc'>fanyiDoc</a>";
                    } else {
                        div = "Err: " + d.errorCode + ", See <a href='http://deepi.sogou.com/docs/fanyiDoc'>fanyiDoc</a>";
                    }
                }
                div = div.replace("{{language}}", srcLanguage);
                div = div.replace("{{src}}", d.query);
                div = div.replace("{{translate}}", d.translation);
            } else if (xhr.status !== 200) {
                div = "ERROR：" + xhr.responseText;
            }
            translateDiv.innerHTML = div;
            translateDiv.style.display = 'block';
        };
        xhr.send(data);
    }


    showIcon.onclick = function (ev) {
        console.log("Click: %o", new Date());
        ev = ev || window.event;
        let left = ev.clientX, top = ev.clientY;
        translateDiv.style.display = "block";
        translateDiv.style.left = left + 'px';
        translateDiv.style.top = top + 'px';

        let salt = getSalt();
        // let pid = "xxx";
        // let key = "xxx";
        // 申请api
        let pid = "xxx";
        let key = "xxx";

        translateText = translateText.trim();
        let src = pid + translateText + salt + key;
        let sign = MD5(src);
        translateText = encodeURI(translateText);
        let data =
            "q=" + translateText +
            "&pid=" + pid +
            "&to=zh-CHS" +
            "&from={{srcLanguage}}" +
            "&salt=" + salt +
            "&sign=" + sign;

        detectlanguage(translateText, data);
    };

    showIcon.onmouseup = function (ev) {
        ev = ev || window.event;
        ev.cancelBubble = true;
    };

    // 点击页面隐藏弹出框
    document.onclick = function (ev) {
        showIcon.style.display = 'none';
        translateDiv.style.display = 'none';
    };

    // 阻止事件冒泡，防止点击翻译框后隐藏
    translateDiv.onclick = function (ev) {
        event.stopPropagation();
    };

    // 获取随机数字字符串
    function getSalt() {
        let salt = "";
        for (let i = 0; i < 5; i++) salt += parseInt(Math.random() * 8);
        return salt;
    }


};