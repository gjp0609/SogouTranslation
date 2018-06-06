window.onload = function () {
    var script_element = document.createElement("script");
    script_element.setAttribute("type", "text/javascript");
    script_element.setAttribute("src", "https://apps.bdimg.com/libs/jquery/1.9.1/jquery.min.js");
    document.body.appendChild(script_element);


    var translateText;
    var showIcon = document.createElement("div");
    showIcon.innerHTML = " 译 ";
    showIcon.style.display = 'none';
    showIcon.style.backgroundColor = '#FFF';
    showIcon.style.borderWidth = '2px';
    showIcon.style.borderStyle = 'solid';
    showIcon.style.borderColor = '#000';
    showIcon.style.borderRadius = '20px';
    showIcon.style.padding = '4px';
    showIcon.style.cursor = 'pointer';
    showIcon.style.position = 'fixed';
    showIcon.style.zIndex = 30000;
    document.body.appendChild(showIcon);

    var translateDiv = document.createElement("div");
    translateDiv.style.display = 'none';
    translateDiv.style.backgroundColor = '#FFF';
    translateDiv.style.borderWidth = '2px';
    translateDiv.style.borderStyle = 'solid';
    translateDiv.style.borderRadius = '10px';
    translateDiv.style.borderColor = '#000';
    translateDiv.style.padding = '5px';
    translateDiv.style.cursor = 'pointer';
    translateDiv.style.position = 'fixed';
    translateDiv.style.zIndex = 30006;
    document.body.appendChild(translateDiv);

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

    // 跨域
    function getHttpObj() {
        var httpobj = null;
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


    showIcon.onclick = function (ev) {
        ev = ev || window.event;
        let left = ev.clientX, top = ev.clientY;
        translateDiv.style.display = "block";
        translateDiv.style.left = left + 'px';
        translateDiv.style.top = top + 'px';

        let salt = getSalt();
        // 申请api
        // let pid = "xx";
        let pid = "xx";
        // let key = "xx";
        let key = "xx";

        translateText = translateText.trim();
        // let src = pid + translateText + salt + key;
        let src = pid + translateText + salt + key;
        let sign = MD5(src);
        translateText = encodeURI(translateText);
        let data =
            "q=" + translateText +
            "&pid=" + pid +
            "&to=zh-CHS" +
            "&from=en" +
            "&salt=" + salt +
            "&sign=" + sign;

        let div = `
            <div>
                <span>src:</span>
                <span>{{src}}</span>
            </div>
            <div>
                <span>translate:</span>
                <span>{{translate}}</span>
            </div>
        `;

        function strToJson(str) {
            var json = (new Function("return " + str))();
            return json;
        }

        // send
        let xhr = getHttpObj();
        // xhr.open("post", "https://fanyi-api.baidu.com/api/trans/vip/translate", true);
        xhr.open("post", "https://fanyi.sogou.com/reventondc/api/sogouTranslate", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function () {
            let d = strToJson(xhr.responseText);
            if (xhr.readyState === 4 && xhr.status === 200) {
                div = div.replace("{{src}}", d.query);
                div = div.replace("{{translate}}", d.translation);
                translateDiv.innerHTML = div;
                translateDiv.style.display = 'block';
            }
        };
        xhr.send(data);
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