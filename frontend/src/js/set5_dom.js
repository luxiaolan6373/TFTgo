const set5_dom = new (function () {
  // 点击英雄头像弹窗dom —— 羁绊列表
  this.heroDialogDomRaceJob = `
  <li>
    <span class="class-for-job-hover" data="%s" type="%s">
      <i class="left-icon"><img src="%s"></i>
      <p class="left-job">%s</p>
    </span>
  </li>
  `
  // 点击英雄头像弹窗dom —— 协同英雄
  this.heroDialogDomRaceJobHeros = `
  <div class="help-pic cost%s"><img src="%s" data="%s"></div>
  `
  // 点击英雄头像弹窗dom —— 羁绊详情 —— 羁绊等级
  this.heroDialogDomRaceJobListLevel = `<p class="job-text-txt"><span>%s</span>%s</p>`
  // 点击英雄头像弹窗dom —— 羁绊详情
  this.heroDialogDomRaceJobList = `
    <div class="right-relation">
      <div class="relation-title">
        <i class="left-icon"><img src="%s"></i>
        <p class="left-job">%s</p>
        <p class="left-job-text">
          %s
        </p>
        %s
      </div>
    </div>
  `
  // 点击英雄头像弹窗dom
  this.heroDialogDom = `
  <div class="dia-con hero-cont">
    <div class="hero-top">
        <p>云顶之弈</p>
    </div>
    <div class="hero-left">
        <div class="left-box1">
            <div class="left-pic cost%s">
                <img src="%s">
            </div>
            <div class="left-txt1">
                <p class="left-name">%s</p>
                <p class="left-price"><i></i>%s金币</p>
            </div>
        </div>
        <ul class="left-box2">
            %s
        </ul>
        <div class="left-box3">
            <p class="help">协同英雄</p>
            <div class="help-pic-box">
                %s
            </div>
        </div>
    </div>
    <div class="hero-right">
        <!-- 技能描述 -->
        <div class="right-skill">
            <p class="skll-title">技能</p>
            <div class="skll-box-msg">
                <div class="skill">
                    <img src="%s">
                </div>
                <div class="skill-explain">
                    <p class="explain1">%s</p>
                    <p class="explain2">%s</p>
                </div>
                <p class="skill-des">
                    %s
                </p>
            </div>
        </div>
        <div class="right-equipment">
          <p class="equip-title">推荐装备</p>
          %s
        </div>
        <!-- 羁绊描述 根据棋子羁绊创建n个-->
        %s
    </div>
</div>
<a class="dia-close" href="javascript:showDialog.hide()" title="关闭">×</a>
  `
  // 装备详情弹窗dom
  this.equipDialog = `
  <div class="hover2-cont">
    <div class="hover2-box1" style="%s">
      <div class="hover2-equip"><img src="%s"></div>
      <div class="hover2-msg">
        <h2 class="hover2-title">%s</h2>
        <p class="hover2-text">
          %s
        </p>
      </div>
    </div>
    <div class="hover2-box2" style="%s">
      <p>配方:</p>
      %s
    </div>
    <div class="hover2-border1"></div>
    <div class="hover2-border2"></div>
  </div>
  `
  // 羁绊弹窗 -- 英雄列表
  this.raceJobDomHeros = `
    <div class="hero-pic cost%s">
      <img src="%s" data="%s" alt="">
    </div>
  `
  // 羁绊弹窗 -- 各等级属性
  this.raceJobDomLevels = `
  <li>
    <p class="hover3-details details1"><i class="hover3-num">%s</i>%s</p>
  </li>
  `
  // 羁绊弹窗
  this.raceJobDialog = `
  <div class="hover3-cont">
    <div class="hover3-box1">
      <h2><i class="hover3-icon"><img
            src="%s"></i><span
          class="hover-name">%s</span></h2>
      <p class="hover-text">%s</p>
    </div>
    <ul class="hover3-box2">
      %s
    </ul>
    <div class="hover3-box3">
      <p>英雄:</p>
      <div class="hover3-hero">
        %s
      </div>
    </div>
    <div class="hover3-border1"></div>
    <div class="hover3-border2"></div>
  </div>
  `
  // 英雄详情弹窗 —— 英雄羁绊
  this.chessDialogRaceJob = `
  <p class="tie tie3">
    <i class="tie-icon tie-icon%s"><img src="%s"></i>
    <span class="tie-txt tie-txt3">%s</span>
  </p>
  `
  // 英雄详情弹窗
  this.chessDialog = `
  <div class="hover4-cont">
    <div class="hover4-box1">
      <div class="hover4-name">
        <!-- cost1-cost5 分别对应1费-5费棋子的边框颜色 -->
        <div class="hover4-pic cost%s">
          <img src="%s" alt="">
        </div>
        <p class="hover4-title">%s</p>
      </div>
      <div class="hover4-tie">
        %s
      </div>
      <div class="hover4-price">
        <i class="price-icon"></i>
        <p class="price-num">%s金币</p>
      </div>
    </div>
    %s
    <div class="hover4-box3">
      <div class="hover4-left">
        <p class="left-text3">技能</p>
        <p class="left-text4">描述</p>
      </div>
      <div class="hover4-skill">
        <img src="%s">
      </div>
      <div class="skill-text">
        <p class="skill-text1">%s</p>
        <p class="skill-text2">%s</p>
      </div>
      <p class="skill-msg">
        %s
      <p>
    </div>
    <div class="hover4-border1"></div>
    <div class="hover4-border2"></div>
  </div>
  `
  // 英雄hover弹窗 —— 推荐装备dom
  this.heroDialogEquipmentList = `
  <div class="hover4-box2">
      <div class="hover4-left">
        <p class="left-text1">推荐</p>
        <p class="left-text2">装备</p>
      </div>
      %s
    </div>
  `
  // 英雄hover弹窗 —— 推荐装备dom
  this.heroDialogEquipment = `
  <div class="hover4-equip">
    <img src="%s">
  </div>
  `
  // 装备弹窗dom —— 配方
  this.equipDialogFormula = `
    <div class="hover2-formula formula%s"><img src="%s"></div>
  `
  this.listTag = `<p class="info-tag1"><span>%s</span></p>`
  this.listSpeciality = `<p class="info-tag2"><span>%s</span></p>`
  // 列表
  this.list = `
    <!-- 未展开状态 -->
    <div class="box-backdrop"></div>
    <div class="item">
      <div class="item-bg"
        style="background-image: url(%s);">
      </div>
      <div class="item-info">
        <h2 class="info-title">%s</h2>
        %s
        %s
        <div class="info-tips" style="%s" info="%s"></div>
      </div>
      <p class="item-grade">
        <span>%s</span>
      </p>
      <ul class="item-member"></ul>
    </div>
    <!-- 展开状态 -->
    <div class="details">
      <!-- 阵容羁绊 -->
      
      <div class="job-box">
        <h2 class="details-title"><i class="title-icon"></i>阵容羁绊</h2>
      </div>

      <!-- 海克斯 -->
      <div class="interim-box3 ">
    <h2 class="details-title"><i class="title-icon"></i>海克斯<i class="info-tips2" hex_info="%s"></i></h2>
    </div>

      <!-- 过渡阵容 -->
      <div class="interim-box">
        <h2 class="details-title"><i class="title-icon"></i>过渡阵容</h2>
      </div>
      <!-- 过渡羁绊 -->
      <div class="transit-job">
      </div>
      <!-- 装备优先级 -->
      <div class="order-box">
        <h2 class="details-title"><i class="title-icon"></i>装备优先级</h2>
      </div>
      <!-- 阵容站位 -->
      <div class="position-box">
        <h2 class="details-title"><i class="title-icon"></i>阵容站位</h2>
      </div>
    </div>
  `
  // 封面英雄列表
  this.listHero = `
  <li>
    <!-- cost1-cost5 分别对应1费-5费棋子的边框颜色 -->
    <div class="member-pic cost%s">
      <img src="%s" data="%s" equip_id="%s" alt="">
    </div>
    <div class="member-equip">
      %s
    </div>
    <p class="member-name">%s</p>
    %s%s
  </li>
  `
  // 优先三星
  this.listHeroStarFirst = `<i class="icon-star"></i>`
  // 主C英雄
  this.listHeroCarryHero = `<i class="icon-carry"></i>`
  // 封面英雄装备列表
  // this.listEquip = `
  //   <div class="equip-box" data="%s"><img src="%s"></div>
  // `
  // 比赛羁绊
  this.raceJob = `
    <h2 class="details-title"><i class="title-icon"></i>阵容羁绊</h2>
      %s
    <a href="javascript:void(0);" class="btn-job" data="%s" onclick="PTTSendClick('btn','btn-job','阵容看点');">阵容看点</a>
  `
  this.raceJobList = `
    <div class="job-name" type="%s" data="%s">
        <div class="name-icon job%s"><img src="%s"></div>
        <div class="name-txt">%s %s</div>
    </div>
  `
  // 过渡阵容
  this.raceChessDSort = `
    <h2 class="details-title"><i class="title-icon"></i>过渡阵容</h2>
    <div class="interim interim1">
      <p class="interim-title">前期</p>
      %s
    </div>
    <div class="interim interim2 %s">
      <p class="interim-title">中期</p>
      %s
    </div>
    <div class="interim interim3 %s">
      <p class="interim-title">备选</p>
      %s
    </div>
  `
  // 过渡阵容英雄列表分隔符
  this.raceChessDSortHeroListSplit = '<div class="interim-group">%s<div class="interim-arrow"></div>%s</div>'
  // 过渡阵容英雄列表
  this.raceChessDSortHeroList = `
  <div class="interim-msg">
    <!-- cost1-cost5 分别对应1费-5费棋子的边框颜色 -->
    <div class="interim-pic cost%s"><img src="%s" data="%s" alt=""></div>
    <div class="interim-equip">
      %s
    </div>
  </div>
  `
  // 过渡阵容英雄的装备列表
  this.raceChessDSortHeroEquipList = `
    <div class="equip-box" data="%s"><img src="%s"></div>
  `
  // 装备优先级栏目
  this.raceEquitSort = `
    <h2 class="details-title"><i class="title-icon"></i>装备优先级</h2>
    <!-- cost1-cost5 分别对应1费-5费棋子的边框颜色 -->
    <div class="order-pic cost%s">
      <img src="%s" data="%s" alt="">
    </div>
    %s
  `
  // 装备优先级栏目 -- 必备装备列表
  this.raceEquitSortMainEquip = `
  <div class="order order1">
    <p class="order-title">必备</p>
    <div class="order-equip">
      %s
    </div>
  </div>
  `
  // 装备优先级栏目 -- 备选装备列表
  this.raceEquitSortBackupEquip = `
  <div class="order order2">
    <p class="order-title">替代</p>
    <div class="order-equip">
      %s
    </div>
  </div>
  `
  // 装备优先级栏目 -- 光明装备列表
  this.raceEquitSortRadiantEquip = `
  <br /><div class="order order2 order-equip-sort">
    <p class="order-title">推荐光明武器</p>
    <div class="order-equip">
      %s
    </div>
  </div>
  `

  // 装备优先级栏目 -- 抢装顺序装备列表
  this.raceEquitSortEquip = `
  <br /><div class="order order-equip-sort">
    <p class="order-title">抢装顺序</p>
    <div class="order-equip">
      %s
    </div>
  </div>
  `
  // 装备优先级栏目 -- 装备列表
  this.raceEquitSortEquipList = `
    <div class="equip-box" data="%s"><img src="%s"></div>
  `
  // 比赛阵容站位
  this.raceChessPosition = `<h2 class="details-title"><i class="title-icon"></i>阵容站位</h2>%s`
  // 阵容内的英雄dom
  this.raceChessPositionHero = `<div class="champion position%s">
    <img src="%s" data="%s" alt="">
  </div>`
  // 比赛前期阵容
  this.raceChessPositionForent = `
  <div class="position-item position-item1">
    <div class="position-title pt1">
      <p>前期</p>
    </div>
    <div class="position-bg">
      %s
    </div>
  </div>
  `
  // 比赛中期阵容
  this.raceChessPositionMiddle = `
  <div class="position-item position-item2">
    <div class="position-title pt1">
      <p>中期</p>
    </div>
    <div class="position-bg">
      %s
    </div>
  </div>
  `
  // 比赛后期阵容 —— 无一套站位
  this.raceChessPositionEndLoney = `
  <div class="position-item position-item2">
    <div class="position-title pt1 info-tips-2 on" info="%s">
      <p>站位</p>
    </div>
    <div class="position-bg">
      %s
    </div>
  </div>
  `
  // 比赛后期阵容 —— 有两套站位
  this.raceChessPositionEnd = `
  <div class="position-item position-item3">
    <div class="position-tab">
      <div class="itab itab1 info-tips-2 on" info="%s">
        <p>站位1</p>
      </div>
      <div class="itab itab2 info-tips-2" info="%s">
        <p>站位2</p>
      </div>
    </div>
    <div class="position-bg">
      %s
    </div>
    <div class="position-bg" style="display:none">
      %s
    </div>
  </div>
  `
  // 过渡羁绊dom
  this.transJobRace = `
    <div class="transit-box transit-box1">
    %s
    %s
    </div>
  `
  // 过渡羁绊dom —— 前期
  this.transJobRaceFront = `
    <p class="transit-title">前期羁绊</p>
    %s
  `
  // 过渡羁绊dom —— 中期
  this.transJobRaceMiddle = `
    <p class="transit-title">中期羁绊</p>
    %s
  `
  // 过渡羁绊dom —— 列表
  this.transJobRaceList = `
    <div class="transit-info"  type="%s" data="%s">
      <div class="transit-icon job%s"><img src="%s"></div>
      <div class="transit-name">%s %s</div>
    </div>
  `

})

