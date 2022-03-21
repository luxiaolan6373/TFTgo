//选择阵容
$(document).on('click', '.item-grade', function () {
    //$(this)[0].style.color="#FFFF00"
    var el_list = $(this).parent().find('p.member-name');
    var chess_list = new Array();
    for (const el of el_list) {
        chess_list.push($(el).text());
    }

    window.go.main.App.GetCurrentDate(chess_list)
})
// 切换阵容I 阵容II
$(document).on('click', '.position-tab .itab', function () {
    let index = $(this).index()
    $(this).parent().find('.itab').removeClass('on')
    $(this).addClass('on')
    $(this).parents('.position-item').find('.position-bg').hide(0)
    $(this).parents('.position-item').find('.position-bg').eq(index).css({'display': 'inline-block'})
})
//列表展开&收起
$('body').on('click', '.box .item', function () {
    $(this).parent().toggleClass('unfold');
});
// 阵容看点btn-job
$(document).on('click', '.box .btn-job', function () {
    let data = $(this).attr('data')
    $('.pop-focus .focus-box').html(`
    <li class="focus-item1">
        <h2><i></i>前期过渡</h2>
        <p class="focus-text">
            ${set5_main.hot_info[data].early_info}
        </p>
    </li>
    <li class="focus-item2">
        <h2><i></i>搜牌节奏</h2>
        <p class="focus-text">
            ${set5_main.hot_info[data].d_time}
        </p>
    </li>
    <li class="focus-item3">
        <h2><i></i>阵型站位</h2>
        <p class="focus-text">
            ${set5_main.hot_info[data].location_info}
        </p>
    </li>
    <li class="focus-item3" ${+set5_main.hot_info[data].location_info_2 ? '' : 'style="display:none"'}>
        <h2><i></i>阵型站位II</h2>
        <p class="focus-text">
            ${set5_main.hot_info[data].location_info_2}
        </p>
    </li>
    <li class="focus-item3">
        <h2><i></i>装备分析</h2>
        <p class="focus-text">${set5_main.hot_info[data].equipment_info}</p>
    </li>
    <li class="focus-item4">
        <h2><i></i>克制分析</h2>
        <p class="focus-text">${set5_main.hot_info[data].enemy_info}</p>
    </li>`)
    TGDialogS('pop-focus')
});

//感叹号.info-tips hover状态 一句话概括阵容运营核心
$('body').on('mouseenter', '.info-tips-2', function (e) {

    if (!$(this).attr('info')) {
        return
    }
    let dom = document.createElement('div')
    dom.className = 'hover1'
    dom.innerHTML = `<div class="hover1-backdrop"><p class="hover1-border"></p></div><div class="hover1-cont"><p class="hover1-text">${$(this).attr('info')}</p></div>`

    let mX = e.pageX
    let mY = e.pageY
    // 窗口宽高
    let windowX = $('#content').width()
    let windowY = $('#content').height() - $("#header").height()
    // 弹窗宽高
    document.body.appendChild(dom);
    let domX = $(dom).width()
    let domY = $(dom).height()
    let position = {
        left: windowX - mX > domX + 10 ? mX + 10 : mX - domX - 10,
        top: windowY - mY > domY + 10 ? mY : mY - domY
    }
    $(dom).css({left: `${position.left}px`, top: `${position.top}px`})
    $(this).on('mouseleave', function () {
        $('.hover1').remove();
    })
})

//感叹号.info-tips hover状态 一句话概括阵容运营核心
$('body').on('mouseenter', '.info-tips', function (e) {
    if (!$(this).attr('info')) {
        return
    }
    let dom = document.createElement('div')
    dom.className = 'hover1'
    dom.innerHTML = `<div class="hover1-backdrop"><p class="hover1-border"></p></div><div class="hover1-cont"><p class="hover1-text">${$(this).attr('info')}</p></div>`

    let mX = e.pageX
    let mY = e.pageY
    // 窗口宽高
    let windowY = $('#content').height() - $("#header").height()
    // 弹窗宽高
    document.body.appendChild(dom);

    let domX = $(dom).width()
    let domY = $(dom).height()
    let position = {left: mX > domX / 2 ? mX - domX / 2 : mX, top: windowY - mY > domY + 20 ? mY + 20 : mY - domY - 20}
    $(dom).css({left: `${position.left}px`, top: `${position.top}px`})
    $(this).on('mouseleave', function () {
        $('.hover1').remove();
    })
})


//感叹号.info-tips2 hover状态 海克斯分析
$('body').on('mouseenter', '.details-title .info-tips2', function (e) {

    if (!$(this).attr('hex_info')) {
        return
    }

    let dom = document.createElement('div')
    dom.className = 'hover1'
    dom.innerHTML = `<div class="hover1-backdrop"><p class="hover1-border"></p></div><div class="hover1-cont"><p class="hover1-text">${$(this).attr('hex_info')}</p></div>`

    console.log(3333, $(this));

    let mX = e.pageX
    let mY = e.pageY
    // 窗口宽高
    let windowY = $('#content').height() - $("#header").height()
    // 弹窗宽高
    document.body.appendChild(dom);

    let domX = $(dom).width()
    let domY = $(dom).height()
    let position = {left: mX > domX / 2 ? mX - domX / 2 : mX, top: windowY - mY > domY + 20 ? mY + 20 : mY - domY - 20}
    $(dom).css({left: `60px`, top: `${position.top}px`})
    $(this).on('mouseleave', function () {
        $('.hover1').remove();
    })
})


// 英雄头像点击
$('body').on('click', '.help-pic img,.member-pic img,.interim-pic img,.order-pic img,.champion img', function (e) {
    e.stopPropagation();
    let chess_id = $(this).attr('data')
    let innerHtml = set5_main.getHeroDialogDomById(chess_id)
    $('.pop-hero').html(innerHtml)
    TGDialogS('pop-hero')
})
//棋子 hover状态 羁绊 & 费用 & 技能 & 推荐装备
$('body').on('mouseenter', '.help-pic img,.member-pic img,.interim-pic img,.order-pic img,.champion img', function (e) {
    // 鼠标位置
    let mX = e.pageX
    let mY = e.pageY
    // 窗口宽高
    let windowX = $('#content').width()
    let windowY = $('#content').height() - $("#header").height()
    // 填充弹窗内容
    let chess_id = $(this).attr('data')
    let equip_id = $(this).attr('equip_id')
    let innerHtml = set5_main.getHeroDomById(chess_id, equip_id)
    $('.hover4').html(innerHtml)
    // 弹窗宽高
    let domX = $('.hover4').width()
    let domY = $('.hover4').height()
    $('.hover4').css({
        left: windowX - mX > domX + 20 ? mX + 20 : mX - domX - 20,
        top: windowY - mY > domY + 20 ? mY + 20 : mY - domY - 20
    })
    $('.hover4').css('display', 'block')
    $(this).on('mouseleave', function () {
        //这里处理鼠标离开元素的逻辑
        $('.hover4').css('display', 'none')
    })
})

//装备 hover状态 装备详情 & 配方
$('body').on('mouseenter', '.equip-box', function (e) {
    //这里处理鼠标停留在元素上的逻辑
    // 鼠标位置
    let mX = e.pageX
    let mY = e.pageY
    // 窗口宽高
    let windowX = $('#content').width()
    let windowY = $('#content').height() - $("#header").height()
    // 填充弹窗内容
    var equipId = $(this).attr('data')
    var innerHtml = set5_main.getEquidDomById(equipId)
    $('.hover2').html(innerHtml)
    // 弹窗宽高
    let domX = $('.hover2').width()
    let domY = $('.hover2').height()
    $('.hover2').css({
        left: windowX - mX > domX + 20 ? mX + 20 : mX - domX - 20,
        top: windowY - mY > domY + 20 ? mY + 20 : mY - domY - 20
    })
    $('.hover2').css('display', 'block')
    $(this).on('mouseleave', function () {
        //这里处理鼠标离开元素的逻辑
        $('.hover2').hide(0);
    })
})

//羁绊 hover状态 羁绊效果 & 组成
$(document).on('mouseenter', '.job-box .job-name , .class-for-job-hover, .transit-info', function (e) {
    // 鼠标位置
    let mX = e.pageX
    let mY = e.pageY
    // 窗口宽高
    let windowX = $('#content').width()
    let windowY = $('#content').height() - $("#header").height()
    let id = $(this).attr('data')
    let type = $(this).attr('type')
    let innerHtml = set5_main.getRaceJobDomById(id, type)
    $('.hover3').html(innerHtml)
    // 弹窗宽高
    let domX = $('.hover3').width()
    let domY = $('.hover3').height()

    $('.hover3').css({
        left: windowX - mX > domX + 20 ? mX + 20 : mX - domX - 20,
        top: windowY - mY > domY + 20 ? mY + 20 : (mY > domY + 20 ? mY - domY - 20 : mY - (domY / 2) - 20)
    })
    $('.hover3').css('display', 'block')
    $(this).on('mouseleave', function () {
        //这里处理鼠标离开元素的逻辑
        $('.hover3').css('display', 'none')
    })
})

// 海克斯 hover状态
$('body').on('mouseenter', '.hex-msg', function (e) {
    //这里处理鼠标停留在元素上的逻辑
    // 鼠标位置
    let mX = e.pageX
    let mY = e.pageY
    // 窗口宽高
    let windowX = $('#content').width()
    let windowY = $('#content').height() - $("#header").height()
    // 填充弹窗内容
    var hexId = $(this).attr('data-id')
    var hexImg = $(this).find('img').attr('src')
    var innerHtml = set5_main.getHexDomById(hexId, hexImg)
    $('.hover2').html(innerHtml)
    // 弹窗宽高
    let domX = $('.hover2').width()
    let domY = $('.hover2').height()
    $('.hover2').css({
        left: windowX - mX > domX + 20 ? mX + 20 : mX - domX - 20,
        top: windowY - mY > domY + 20 ? mY + 20 : mY - domY - 20
    })
    $('.hover2').css('display', 'block')
    $(this).on('mouseleave', function () {
        //这里处理鼠标离开元素的逻辑
        $('.hover2').hide(0);
    })
})


//弹出层
function TGDialogS(e) {
    // 利用milo库引入dialog组件
    need("biz.dialog", function (Dialog) {

        Dialog.show({

            id: e,
            bgcolor: '#000', //弹出“遮罩”的颜色，格式为"#FF6600"，可修改，默认为"#fff"
            fixed: true, //该值默认为false，当为true的时候，将随屏幕滚动
            iTop: 200,
            opacity: 50, //弹出“遮罩”的透明度，格式为｛10-100｝，可选
        });

        //修改位置为左上角 方便查看
        $("#"+e).css("left",330);
        $("#"+e).css("top",100);
    });
}

function closeDialog() {
    // 利用milo库引入dialog组件
    need("biz.dialog", function (Dialog) {
        Dialog.hide();
    });
}

//自动变大变小 .hotList

$(function(){
    var $wind = $(window); //加载窗口
    var $mainFame = $('.main-fame'); //阵容列表框架
    var $hotList = $('.hotList'); //阵容列表框架
    var $hotNewest = $('.hotNewest'); //大背景
    var winH= $wind.outerHeight();//窗口高度

    $mainFame.height(winH);
    $hotList.height(winH);
    $hotNewest.height(winH);
//resize事件处理
    $wind.resize(function(){
        var newH = $wind.outerHeight();
        $mainFame.height(newH);
        $hotList.height(newH);
        $hotNewest.height(newH);
    })
})