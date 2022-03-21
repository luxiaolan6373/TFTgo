(function (o) {
    if (window.attachEvent) {
        window.attachEvent("onload", o);
    } else {
        window.addEventListener("load", o, false);
    };
})

var d = document,
    m = d.createElement("nav"),
    r = String(new Date()).split(":")[1],
    s = d.createElement('style'),
    styleText =
        '.redPoint{position:absolute;top:3px;right:12px;width:6px;height:6px;box-sizing:border-box;border-radius:50%;flex-shrink:0;background:#010a13;box-shadow:0 0 0 1px #010a13;background-color:#c89b3c}.Menu{position:relative;z-index:1000;margin-top:9px}.SubNavList{display:flex;flex-wrap: wrap;width:100%;height:20px;text-shadow:0 0 2px #000}.SubNavList li{display:flex;position:relative;}.SubNavList a{min-width:28px;line-height:22px;white-space:nowrap;text-overflow:ellipsis;font-size:12px;font-family:Microsoft YaHei;color:#cdbe91;padding:0 15px;letter-spacing:.1em;transition:all .3s ease}.SubNavList a.active,.SubNavList a:hover{color:#f0e6d2}.SubNavList a.active:before{content:"";position:absolute;left:0;top:20px;height:1px;width:100%;margin:0;background:linear-gradient(to left,transparent,#cdbe91,transparent);transition:all .5s cubic-bezier(.75,-.56,.2,1.66)}}';
s.type = 'text/css';
if (s.styleSheet) { //ie
    s.styleSheet.cssText = styleText;
} else {
    s.innerHTML = styleText;
}
d.getElementsByTagName('head')[0].appendChild(s);
m.className = "Menu";
liHtml = '<ul id="SubNavList" class="SubNavList">';

function getC(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return unescape(c.substring(nameEQ.length, c.length));
        }
    }
    return false;
};

function clearCookie(name) {
    setC(name, "", -1);
};

function setC(name, value, seconds) {
    seconds = seconds || 0;
    var expires = "";
    if (seconds != 0) {
        var date = new Date();
        date.setTime(date.getTime() + (seconds * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + escape(value) + expires + "; path=/";
};
function loadS(a, b, z) {
    var c = document.createElement("script");
    if (z) {
        c.charset = "utf-8";
    }
    c.type = "text/javascript", c.readyState ? c.onreadystatechange = function () {
        ("loaded" == c.readyState || "complete" == c.readyState) && (c.onreadystatechange = null,
        b && b());
    } : c.onload = function () {
        b && b();
    }, c.src = a, document.body.appendChild(c);
}
function linkActive() {
    var navs = document.getElementById("SubNavList").getElementsByTagName("a");
    for (var i = 0; i < navs.length; i++) {
        var getLink = navs[i].getAttribute("href");
        var getUrl = document.location.href;
        var navId = navs[i].getAttribute("id");
        if (getUrl.indexOf(getLink) != -1 && i !== 0) {
            navs[i].className = "active";
            navs[0].className = "";
            navs[i].style.display = "block";
        } else if (getUrl.indexOf(getLink) != -1 && i == 0) {
            navs[i].className = "active";
            navs[i].style.display = "block";
        };
        document.getElementById(navId).onclick = function () {
            var ids = this.getAttribute('id');
            var titleinfo = this.getAttribute('title');
            var index = this.getAttribute('map');
            console.log(ids, titleinfo)
            setC(ids, 'cur')
            window.RClientWindowMessenger.sendMessage({
                messageType: 'rcp-fe-lol-home-play-sound',
                data: {
                    key: 'icon-click'
                }
            });
            //PTTSendClick('btn', '' + ids + '', '' + titleinfo + '')
            PTTSendClick('menu', 'hubmenu' + index + '-' + ids, 'subnavigation-' + index + '')
            //EAS.SendClick({ 'e_c': 'lolclient.clientv3.btn.' + ids + '', 'c_t': 4 });
            EAS.SendClick({ 'e_c': 'lolclient.clientv3.btn.hubmenu' + index + '-' + ids, 'c_t': 4 });
            if (!this.getElementsByTagName('span')[0]) {
                return
            } else {
                this.getElementsByTagName('span')[0].style.display = "none";
            }

        }
        if (getC(navId) == 'cur') {
            if (!navs[i].getElementsByTagName('span')[0]) {
            } else {
                navs[i].getElementsByTagName('span')[0].style.display = "none"
            }
        }
    };
    window.RClientWindowMessenger.addMessageListener({
        messageType: 'rcp-fe-lol-home-data-response',
        handlers: function (messageType, data) {
            var lv = data.clientData.summoner_level;
            //console.log('绛夌骇:'+lv)
            //setTimeout(function () {
            if (lv <= 30) {
                document.getElementById("guide").style.display = "block"
            } else {
                document.getElementById("guide").style.display = "none"
            }
            //}, 500)
        }
    })
    window.RClientWindowMessenger.sendMessage({
        messageType: 'rcp-fe-lol-home-data-request'
    })
}

//==================== 鍥炴祦鏌ヨ 鈫� =============================
function getUserBackStatus() {
    let areaid = sessionStorage.getItem('areaId');
    // 鍥炴祦寮瑰眰
    if (typeof areaid != 'undefined' && areaid != null && parseInt(areaid, 10) > 0) {
        $.ajax({
            //dataType: 'jsonp',
            url: '//lol.sw.game.qq.com/lol/lwdcommact/a20210815return/a20210815return/getBackUser?sArea=' + areaid + '&rid=' + Math.random(),
            success: function (data) {
                if (typeof data != 'undefined' && data != null) {
                    if (data['iRet'] == 0 && data['jData'] && +data['jData']['is_back'] > 0) {
                        $('#returnguide').show()
                    }
                }
            }
        })
    }
}

function showModal() {
    // $('#pop-back').fadeIn()
    // $('#ShowModalMask').fadeIn()
    window.location.href = "https://lol.qq.com/act/a20210815return/index.html"
    PTTSendClick('btn', 'gotoreturn', '杩涘叆鍥炴祦椤电')
    EAS.SendClick({ 'e_c': 'lolclient.clientv3.btn.gotoreturn', 'c_t': 4 });
}

function closeModal() {
    $('#pop-back').fadeOut()
    PTTSendClick('btn', 'closeModalBack', '鍏抽棴鍥炴祦寮瑰眰')
    EAS.SendClick({ 'e_c': 'lolclient.clientv3.btn.closeModalBack', 'c_t': 4 });
}

//==================== 鍥炴祦鏌ヨ 鈫� =============================
loadS("//lol.qq.com/act/AutoCMS/publish/LCU/SubNav/subnav.js", function () {
    for (var i = 0; i < SubNav.length; i++) {
        if (SubNav[i]['display'] == true) {
            liHtml += '<li type="' + SubNav[i]['id'] + '" >';
            liHtml += '<a id=' + SubNav[i]['id'] + ' href="' + SubNav[i]['url'] + '" title="' + SubNav[i]['name'] + '" map="' + (i + 1) + '">' + SubNav[i]['name'] + '';
            if (SubNav[i]['redPoint'] == true) {
                liHtml += '<span class="redPoint"></span>'
            }
            liHtml += '</a></li>';
        } else if (SubNav[i]['default'] == true && SubNav[i]['display'] == false) {
            liHtml += '<li type="' + SubNav[i]['id'] + '" >';
            liHtml += '<a id=' + SubNav[i]['id'] + ' href="' + SubNav[i]['url'] + '" title="' + SubNav[i]['name'] + '" map="' + (i + 1) + '"  style="display:none">' + SubNav[i]['name'] + '';

            if (SubNav[i]['redPoint'] == true) {
                liHtml += '<span class="redPoint"></span>'
            }
            liHtml += '</a></li>';
        }

    }
    liHtml += '</ul>';
    m.innerHTML = liHtml;
    document.getElementById("SubNavs").appendChild(m);
    linkActive();
    // 鍥炴祦
    getUserBackStatus();
}, 'utf-8');
