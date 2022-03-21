let hexArr = [];
let hexObj = {};
const set5_request = new (function () {
    this.queryNum = 0
    this.getTag = function () { // 标签
        $.ajax({
            url: 'https://game.gtimg.cn/images/lol/act/tftzlkauto/json/tagJson/tag.json',
            dataType: 'json',
            success: function (res) {
                set5_request.queryNum++
                window.set5Data.tag = res
            },
            error: function () {
                setTimeout(function () {
                    this.getTag()
                }.bind(this), 300)
            }.bind(this)
        })
    }
    this.getSpeciality = function () { // 标签
        $.ajax({
            url: 'https://game.gtimg.cn/images/lol/act/tftzlkauto/json/specialityJson/speciality.json',
            dataType: 'json',
            success: function (res) {
                set5_request.queryNum++
                window.set5Data.speciality = res
            },
            error: function () {
                setTimeout(function () {
                    this.getSpeciality()
                }.bind(this), 300)
            }.bind(this)
        })
    }
    this.getChess = function () { //棋子
        $.ajax({
            url: '//game.gtimg.cn/images/lol/act/img/tft/js/chess.js',
            //	url: '//game.gtimg.cn/images/lol/act/img/tft/js/12.4-2022.S6/chess.js',
            dataType: 'json',
            success: function (res) {
                set5_request.queryNum++
                window.set5Data.Chess = res.data
            },
            error: function () {
                setTimeout(function () {
                    this.getChess()
                }.bind(this), 300)
            }.bind(this)
        })
    }
    this.getJob = function () { //职业
        $.ajax({
            url: '//game.gtimg.cn/images/lol/act/img/tft/js/job.js',
            //	url: '//game.gtimg.cn/images/lol/act/img/tft/js/12.4-2022.S6/job.js',
            dataType: 'json',
            success: function (res) {
                set5_request.queryNum++
                window.set5Data.job = res.data
            },
            error: function () {
                setTimeout(function () {
                    this.getJob()
                }.bind(this), 300)
            }.bind(this)
        })
    }
    this.getRace = function () { //种族
        $.ajax({
            url: '//game.gtimg.cn/images/lol/act/img/tft/js/race.js',
// 			url: '//game.gtimg.cn/images/lol/act/img/tft/js/12.4-2022.S6/race.js',
            dataType: 'json',
            success: function (res) {
                set5_request.queryNum++
                window.set5Data.race = res.data
            },
            error: function () {
                setTimeout(function () {
                    this.getRace()
                }.bind(this), 300)
            }.bind(this)
        })
    }
    this.getEquip = function () { //装备
        $.ajax({
            url: '//game.gtimg.cn/images/lol/act/img/tft/js/equip.js',
//    url: '//game.gtimg.cn/images/lol/act/img/tft/js/12.4-2022.S6/equip.js',
            dataType: 'json',
            success: function (res) {
                set5_request.queryNum++
                window.set5Data.equip = res.data
            },
            error: function () {
                setTimeout(function () {
                    this.getEquip()
                }.bind(this), 300)
            }.bind(this)
        })
    }
    this.getHero = function () { //小小英雄
        $.ajax({
            url: '//game.gtimg.cn/images/lol/act/img/tft/js/hero.js',
//		url: '//game.gtimg.cn/images/lol/act/img/tft/js/12.4-2022.S6/hero.js',
            dataType: 'json',
            success: function (res) {
                set5_request.queryNum++
                window.set5Data.hero = res.data
            },
            error: function () {
                setTimeout(function () {
                    this.getHero()
                }.bind(this), 300)
            }.bind(this)
        })
    }
    this.hex = function () { //海克斯
        $.ajax({
            url: '//game.gtimg.cn/images/lol/act/img/tft/js/hex.js',
//	url: '//game.gtimg.cn/images/lol/act/img/tft/js/12.4-2022.S6/hex.js',
            dataType: 'json',
            success: function (res) {
                hexArr = res;
                for (let k in hexArr) {
                    hexObj[hexArr[k].hexId] = hexArr[k]
                }
            },
            error: function () {

            }
        })
    }
    this.getLineupList = function () { //获取推荐阵容列表
        return new Promise(function (resolve, reject) {
            $.ajax({
                //url: 'https://game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupJson/s5/7/lineup_detail_total.json',
                //url:'https://game.gtimg.cn/images/lol/act/tftzlkauto/json/t20210517/lineup_detail_total.json',
                //url:'https://game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupJson/s5/40/lineup_detail_total.json',
                //url: '//game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupJson/s6/7/lineup_detail_total.json',//S6版本
                url: '//game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupJson/s6/6/lineup_detail_total.json',//S6.5版本
                dataType: 'json',
                success: function (res) {
                    res = res.lineup_list ? res : { lineup_list: [] }
                    let output = []
                    res.lineup_list.forEach(element => {
                        if (element.detail == '{}') return
                        let detail
                        try {
                            detail = JSON.parse(element.detail.replace(/\r|\n/g, '').replace(/\\/g, '\\\\'))
                        } catch (e) {
                            return
                        }
                        detail = {
                            carry_hero_equip_replace: detail.carry_hero_equip_replace ? detail.carry_hero_equip_replace : { backup: '', main: '' },
                            contact: detail.contact ? detail.contact : [],
                            d_time: detail.d_time ? detail.d_time : '',
                            early_info: detail.early_info ? detail.early_info : '',
                            early_round: detail.early_round ? detail.early_round : '',
                            enemy_info: detail.enemy_info ? detail.enemy_info : '',
                            equipment_info: detail.equipment_info ? detail.equipment_info : '',
                            equipment_order: detail.equipment_order ? detail.equipment_order : '',
                            hero_location: detail.hero_location ? detail.hero_location : [],
                            hero_replace: detail.hero_replace ? detail.hero_replace : '',
                            level_3_heros: detail.level_3_heros ? detail.level_3_heros : '',
                            line_feature: detail.line_feature ? detail.line_feature : '',
                            line_name: detail.line_name ? detail.line_name : '',
                            hexbuff: detail.hexbuff ? detail.hexbuff : { recomm: '', replace: '' },
                            line_tag: detail.line_tag ? detail.line_tag : '',
                            lineup_skin_hero: detail.lineup_skin_hero ? detail.lineup_skin_hero : '',
                            location_info: detail.location_info ? detail.location_info : '',
                            location_info_2: detail.location_info_2 ? detail.location_info_2 : '',
                            metaphase_round: detail.metaphase_round ? detail.metaphase_round : '',
                            y21_early_heros: detail.y21_early_heros ? detail.y21_early_heros : [],
                            y21_early_heros_contact: detail.y21_early_heros_contact ? detail.y21_early_heros_contact : [],
                            y21_metaphase_heros: detail.y21_metaphase_heros ? detail.y21_metaphase_heros : [],
                            y21_metaphase_heros_contact: detail.y21_metaphase_heros_contact ? detail.y21_metaphase_heros_contact : [],
                            radiant_equip_list: detail.radiant_equip_list ? detail.radiant_equip_list : '',
                            hex_info: detail.hex_info ? detail.hex_info : '',
                        }
                        output.push({
                            id: element.id ? element.id : 0,
                            like: element.like ? element.like : 0,
                            quality: element.quality ? element.quality : 'A',
                            rel_time: element.rel_time ? element.rel_time : '2021-05-04 00:00:00',
                            season: element.season ? element.season : '37',
                            author: element.author ? element.author : '12',
                            channel: element.channel ? element.channel : '7',
                            simulator_edition: element.simulator_edition ? element.simulator_edition : '11.9',
                            simulator_season: element.simulator_season ? element.simulator_season : 'S5',
                            sortID: element.sortID ? element.sortID : '272',
                            sub_time: element.sub_time ? element.sub_time : '2021-05-04 00:00:00',
                            detail: JSON.stringify(detail)
                        })
                    })
                    res.lineup_list = output;

                    resolve(res)
                },
                error: reject
            })
        })
    }
    this.getLineupDetail = function (id) { // 获取推荐阵容详情
        this.requireScript(`js/set5-lineup-detail.js?${id}`, function () {
            console.log(lineupData)
        })
    }
    this.requireScript = function (url, callback) {
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.charset = 'utf-8'
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                callback()
                script.onload = script.onreadystatechange = null
            }
        };
        script.src = url
        document.body.appendChild(script)
    }
    this.init = function () {
        this.getChess()
        this.getJob()
        this.getRace()
        this.getEquip()
        this.getTag()
        this.getSpeciality()
        this.hex()
        // this.getHero()
    }
    this.init()
})