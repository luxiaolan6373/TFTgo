function deWeight(arr) {
    let obj = {};
    var newArr = [];
    newArr = arr.reduce((data, item) => {
        obj[item.hexId] ? '' : obj[item.hexId] = true && data.push(item)
        return data
    }, [])
    return newArr
}


const set5_main = new (function () {
    this.hot_info = []
    let error = false
    this.initList = function () {
        set5_request.getLineupList().then(function (res) {
            let sort_key = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5 }
            res.lineup_list.sort(function (a, b) {
                return b.sortID - a.sortID
            })
            res.lineup_list.sort(function (a, b) {
                return sort_key[a.quality] - sort_key[b.quality]
            })
            $('.versions').html(`游戏版本${res.lineup_list[0].simulator_edition}`)

            for (let index = 0; index < res.lineup_list.length; index++) {
                let detail = JSON.parse(res.lineup_list[index].detail)
                let hero_id = +detail.lineup_skin_hero ? detail.lineup_skin_hero : (detail.hero_location[0] || {}).hero_id // TODO 确认是否TFTID
                let hero = this.getHeroById(hero_id) || {}
                let tag = this.getTagById(detail.line_tag)
                let speciality = this.getSpecialityById(detail.line_feature)
                let tag_dom = tag ? common.sprintf(set5_dom.listTag, tag) : ''
                let speciality_dom = speciality ? common.sprintf(set5_dom.listSpeciality, speciality.title) : ''
                let innerHtml = common.sprintf(set5_dom.list, `//game.gtimg.cn/images/lol/tft/cham-icons/624x318/${hero.TFTID}.jpg`, detail.line_name, tag_dom, speciality_dom, speciality ? '' : 'opacity:0', (speciality && speciality.remark) || '', res.lineup_list[index].quality || 'A', detail.hex_info)
                let div = document.createElement('div')
                let hexdata = detail.hexbuff;
                div.className = 'box'
                $(div).html(innerHtml)
                this.initRaceJob(div, detail, index)
                this.initListHero(div, detail, detail.level_3_heros)
                this.initRaceChessDSort(div, detail)
                this.initTransJobRace(div, detail)
                this.initRaceEquitSort(div, detail)
                this.initRaceChessPosition(div, detail)
                this.loadHex(div, hexdata)
                $('.hotList').append(div)
            }
            // for(let i = 0;i<)
        }.bind(this)).catch(function (res) {
            // setTimeout(
            //   function () {
            //     this.initList()
            //   }.bind(this),
            //   300)
            // error = true
        }.bind(this))
    }
    if (error) {
        return;
    }
    this.loadHex = function (div, hexdata) {
        let arr1 = hexdata.recomm.split(',');
        let arr2 = hexdata.replace.split(',');
        let hexhtml = "<div class='hex hex1'><p class='interim-title'>优先</p>";
        let arr = []
        Object.keys(hexArr).forEach(key=>{
            arr.push(hexArr[key]);
        })
        const newArr = deWeight(arr);

        for (let k = 0; k < arr1.length; k++) {
            newArr.forEach(hex => {

                if (arr1[k] === hex.hexId) {
                    hexhtml += "<div class='hex-msg' data-id='" + hex.hexId + "'>"
                        + "<div class='hex-pic cost2'>"
                        + "<img src='" + hex.imgUrl + "'>"
                        + "</div>"
                        + "</div>"
                }
            })
        }


        hexhtml += "</div><div class='hex hex2'><p class='interim-title'>次选</p>";
        for (let j = 0; j < arr2.length; j++) {
            newArr.forEach(hex => {
                if (arr2[j] === hex.hexId) {
                    hexhtml += "<div class='hex-msg' data-id='" + hex.hexId + "'>"
                        + "<div class='hex-pic cost2'>"
                        + "<img src='" + hex.imgUrl + "'>"
                        + "</div>"
                        + "</div>"
                }
            })
        }
        hexhtml += "</div>";
        $(div).find('.interim-box3').append(hexhtml)
    }
    this.getTagById = function (id) { // 获取标签内容
        for (let key in window.set5Data.tag) {
            if (window.set5Data.tag[key].id === id) {
                return window.set5Data.tag[key].title
            }
        }
    }
    this.getHeroByRace = function (race_id) {
        let output = []
        window.set5Data.Chess.forEach(function (val) {
            race_ids = val.raceIds.split(',')
            if (common.inArray(race_id, race_ids)) {
                output.push(val)
            }
        })
        return output
    }
    this.getHeroByJob = function (job_id) {
        let output = []
        window.set5Data.Chess.forEach(function (val) {
            job_ids = val.jobIds.split(',')
            if (common.inArray(job_id, job_ids)) {
                output.push(val)
            }
        })
        return output
    }
    this.getHeroAvatar = function (name) {
        return `//game.gtimg.cn/images/lol/act/img/tft/champions/${name}`
    }
    this.getRaceById = function (id) { //根据id获得种族对象
        return window.set5Data.race.find(function (x) { return x.raceId == id })
    }
    this.getJobById = function (id) { //根据id获得职业对象
        return window.set5Data.job.find(function (x) { return x.jobId == id })
    }
    this.getHeroById = function (id) { //根据id获得棋子对象
        return window.set5Data.Chess.find(function (x) { return x.chessId === id })
    }
    this.getEquidById = function (id) { //根据id获得装备对象
        return window.set5Data.equip.find(function (x) { return x.equipId == id })
    }

    this.getSpecialityById = function (id) { // 获取标签内容
        for (let key in window.set5Data.speciality) {
            if (window.set5Data.speciality[key].id === id) {
                return window.set5Data.speciality[key]
            }
        }
    }
    this.getRaceJobDomById = function (id, type) {
        let hero
        let race_job
        if (type === 'job') {
            race_job = this.getJobById(id)
            hero = this.getHeroByJob(id)
        }
        if (type === 'race') {
            race_job = this.getRaceById(id)
            hero = this.getHeroByRace(id)
        }
        let heroDom = ''
        hero.forEach(function (val) {
            heroDom += common.sprintf(set5_dom.raceJobDomHeros, val.price, this.getHeroAvatar(val.name), val.chessId)
        }.bind(this))
        let race_job_level_dom = ''
        for (let key in race_job.level) {
            race_job_level_dom += common.sprintf(set5_dom.raceJobDomLevels, key, race_job.level[key])
        }
        return common.sprintf(set5_dom.raceJobDialog, race_job.imagePath.replace(/^https?:/, ''), race_job.name, race_job.introduce, race_job_level_dom, heroDom)
    }
    this.getHeroDialogDomById = function (id) {
        let hero = this.getHeroById(id)
        // 根据羁绊获取 羁绊对象,羁绊英雄
        let race_ids = hero.raceIds.split(',')
        let job_ids = hero.jobIds.split(',')
        let race_job_heros = []
        let race_job = []
        race_ids.forEach(function (val) {
            let output = this.getHeroByRace(val)
            race_job.push(this.getRaceById(val))
            output.forEach(function (v) {
                let boolean = race_job_heros.find(function (x) { return x.chessId === v.chessId })
                if (!boolean) {
                    race_job_heros.push(v)
                }
            })
        }.bind(this))
        job_ids.forEach(function (val) {
            let output = this.getHeroByJob(val)
            race_job.push(this.getJobById(val))
            output.forEach(function (v) {
                let boolean = race_job_heros.find(function (x) { return x.chessId === v.chessId })
                if (!boolean) {
                    race_job_heros.push(v)
                }
            })
        }.bind(this))
        // 羁绊属性
        let race_job_dom = ''
        race_job.forEach(function (val) {
            if (val) {
                race_job_dom += common.sprintf(set5_dom.heroDialogDomRaceJob, val.raceId ? val.raceId : val.jobId, val.raceId ? 'race' : 'job', val.imagePath.replace(/^https?:/, ''), val.name)
            }
        })
        // 拥有相同羁绊的英雄
        let race_job_heros_dom = ''
        race_job_heros.forEach(function (val) {
            race_job_heros_dom += common.sprintf(set5_dom.heroDialogDomRaceJobHeros, val.price, this.getHeroAvatar(val.name), val.chessId)
        }.bind(this))
        // 羁绊详情
        let race_job_list_dom = ''
        race_job.forEach(function (val) {
            let race_job_list_level_dom = ''
            if (val) {
                for (let key in val.level) {
                    race_job_list_level_dom += common.sprintf(set5_dom.heroDialogDomRaceJobListLevel, key, val.level[key])
                }
                race_job_list_dom += common.sprintf(set5_dom.heroDialogDomRaceJobList, val.imagePath.replace(/^https?:/, ''), val.name, val.introduce, race_job_list_level_dom)
            }
        })
        let equip_doms = ''
        if (hero.recEquip) {
            let equip_ids = hero.recEquip.match(/\d+/g)
            equip_ids.forEach(function (val) {
                let equip = this.getEquidById(val)
                equip_doms += common.sprintf(set5_dom.listEquip, equip.equipId, equip.imagePath.replace(/^https?:/, ''))
            }.bind(this))
        }

        return common.sprintf(
            set5_dom.heroDialogDom,
            hero.price,
            this.getHeroAvatar(hero.name),
            hero.displayName,
            hero.price,
            race_job_dom,
            race_job_heros_dom,
            hero.skillImage,
            hero.skillName,
            hero.skillType,
            hero.skillIntroduce,
            equip_doms,
            race_job_list_dom
        )
    }
    this.getHeroDomById = function (id, equip_id) {
        let hero = this.getHeroById(id)
        // 初始化羁绊
        let raceIds = hero.raceIds.split(',')
        let jobIds = hero.jobIds.split(',')
        let race_job = []
        raceIds.forEach(function (element) {
            race_job.push(this.getRaceById(element))
        }.bind(this))
        jobIds.forEach(function (element) {
            race_job.push(this.getJobById(element))
        }.bind(this))
        // 如果该阵容下英雄没有推荐装备，获取默认推荐装备
        let equip_list_dom = ''
        if (!equip_id) {
            let equip_doms = ''
            equip_id = hero.recEquip.match(/\d+/g)
            if (equip_id) {
                equip_id.forEach(function (val) {
                    let equipment = this.getEquidById(val)
                    equip_doms += common.sprintf(set5_dom.heroDialogEquipment, equipment.imagePath.replace(/^https?:/, ''))
                }.bind(this))
                equip_list_dom = common.sprintf(set5_dom.heroDialogEquipmentList, equip_doms)
            }
        }
        race_job_dom = ''
        race_job.forEach(function (val) {
            race_job_dom += val ? common.sprintf(set5_dom.chessDialogRaceJob, 2, val.imagePath.replace(/^https?:/, ''), val.name) : ''
        })

        return common.sprintf(
            set5_dom.chessDialog,
            hero.price,
            this.getHeroAvatar(hero.name),
            hero.displayName,
            race_job_dom,
            hero.price,
            equip_list_dom,
            hero.skillImage, // 技能图标
            hero.skillName,
            hero.skillType,
            hero.skillIntroduce // 技能介绍
        )
    }
    this.getEquidDomById = function (id) {
        let equip = this.getEquidById(id)
        let formula_ids = equip.formula ? equip.formula.split(',') : false
        let formula = []
        if (formula_ids && +formula_ids[0] > 0) {
            formula_ids.forEach(function (element) {
                formula.push(this.getEquidById(element))
            }.bind(this))
        }
        let formula_dom = ''
        let j = 0
        for (let i = 0; i < formula.length; i++) {
            if (formula[i]) {
                formula_dom += common.sprintf(set5_dom.equipDialogFormula, j++, formula[i].imagePath.replace(/^https?:/, ''))
            }
        }
        return common.sprintf(set5_dom.equipDialog, formula.length > 0 ? '' : 'border:none', equip.imagePath.replace(/^https?:/, ''), equip.name, equip.effect, formula_dom ? '' : 'display:none', formula_dom)
    }
    this.getHexDomById = function (id, img) {
        console.info(hexObj[id])
        const hexData = hexObj[id]
        let name = '无此装备'
        let desc = '装备信息查询失败'
        if (hexData) {
            name = hexData.name
            desc = hexData.description
        }
        const msgHtml =
            `<div class="hover2-cont">
      <div class="hover2-box1" style="border:none">
        <div class="hover2-equip"><img src="${img}"></div>
        <div class="hover2-msg">
          <h2 class="hover2-title">${name}</h2>
          <p class="hover2-text">${desc}</p>
        </div>
      </div>
      <div class="hover2-border1"></div>
      <div class="hover2-border2"></div>
    </div>`
        return msgHtml
    }
    this.initListHero = function (div, detail, level_3_heros) { // 最终英雄列表
        level_3_heros = (level_3_heros || '').match(/\d+/g)
        let heros = []
        let output = []
        for (let index = 0; index < detail.hero_location.length; index++) {
            let chess = detail.hero_location[index]
            let hero = this.getHeroById(chess.hero_id)
            if (hero) {
                let equipment_id = chess.equipment_id ? chess.equipment_id.split(',') : []
                let equipment = []
                if (equipment_id.length > 0 && +equipment_id[0]) {
                    equipment_id.forEach(function (element) {
                        equipment.push(this.getEquidById(element))
                    }.bind(this));
                }
                if (!common.inArray(chess.hero_id, heros)) {
                    heros.push(chess.hero_id)
                    let equment_dom = ''
                    let equipment_num = 0
                    if (equipment) {
                        for (let equment_index = 0; equment_index < equipment.length; equment_index++) {
                            const element = equipment[equment_index]
                            if (element && element.equipId) { equipment_num++ }
                            // equment_dom += common.sprintf(set5_dom.listEquip, element.equipId, element.imagePath.replace(/^https?:/, ''))
                        }
                    }
                    output.push({
                        price: hero.price,
                        is_carry_hero: chess.is_carry_hero, // TODO isCarry 是否有特殊样式
                        equipment_num: equipment_num,
                        dom: common.sprintf(set5_dom.listHero, hero.price, this.getHeroAvatar(hero.name), hero.chessId, chess.equipment_id || '', equment_dom, hero.displayName, chess.is_carry_hero ? set5_dom.listHeroCarryHero : '', common.inArray(hero.chessId, level_3_heros) ? set5_dom.listHeroStarFirst : '')
                    })
                }
            } else {
            }
        }
        // output = output.sort(function (a, b) { return b.equipment_num - a.equipment_num + (+b.is_carry_hero) * 100 - (+a.is_carry_hero) * 100 })
        output = output.sort(function (a, b) { return b.equipment_num - a.equipment_num })
        let innerHtml = ''
        for (let index = 0; index < output.length; index++) {
            innerHtml += output[index].dom
        }
        $(div).find('.item .item-member').append(innerHtml)
    }
    this.initRaceJob = function (div, detail, index) { // 比赛羁绊
        // 阵容看点弹窗对象
        this.hot_info[index] = {
            early_info: detail.early_info,      // 前期
            d_time: detail.d_time,      // 搜牌
            location_info: detail.location_info,      // 站位说明
            location_info_2: detail.location_info_2,      // 第二套阵容站位说明
            equipment_info: detail.equipment_info,      // 装备分析说明
            enemy_info: detail.enemy_info, // 克制分析
        }
        let raceJobListInnerHTML = ''
        detail.contact.forEach(function (element) {
            let race_job // 根据type获取羁绊对象 type = race || job
            if (element.type === 'race') {
                race_job = this.getRaceById(element.id)
                if (!(element.color < 5)) {
                    try {
                        element.color = handleColor(race_job.race_color_list, element.num)
                    } catch (error) {
                        console.error('羁绊color获取失败:', error)
                    }
                }
            } else if (element.type === 'job') {
                race_job = this.getJobById(element.id)
                if (!(element.color < 5)) {
                    try {
                        element.color = handleColor(race_job.job_color_list, element.num)
                    } catch (error) {
                        console.error('职业color获取失败:', error)
                    }
                }
            }

            if (race_job) {
                raceJobListInnerHTML += common.sprintf(set5_dom.raceJobList, element.type, element.id, element.color, race_job.imagePath.replace(/^https?:/, ''), element.num, race_job.name)
            }
        }.bind(this))
        let innerHtml = common.sprintf(set5_dom.raceJob, raceJobListInnerHTML, index)
        $(div).find('.job-box').html(innerHtml)
    }
    this.initRaceChessDSort = function (div, detail) { // 过渡阵容
        let output_y21_early_heros = '' // 前期过渡阵容
        let output = []
        for (let index = 0; index < detail.y21_early_heros.length; index++) {
            let chess = detail.y21_early_heros[index]
            let hero = this.getHeroById(chess.hero_id)
            let equipment_id = chess.equipment_id ? chess.equipment_id.split(',') : []
            let equipment = []
            if (equipment_id.length > 0 && +equipment_id[0]) {
                equipment_id.forEach(function (element) {
                    equipment.push(this.getEquidById(element))
                }.bind(this));
            }
            let equment_dom = ''
            if (equipment) {
                for (let equment_index = 0; equment_index < equipment.length; equment_index++) {
                    const element = equipment[equment_index]
                    equment_dom += common.sprintf(set5_dom.raceChessDSortHeroEquipList, element.equipId, element.imagePath.replace(/^https?:/, ''))
                }
            }
            output_y21_early_heros += common.sprintf(set5_dom.raceChessDSortHeroList, hero.price, this.getHeroAvatar(hero.name), hero.chessId, equment_dom)
        }
        let output_y21_metaphase_heros = '' // 中期过渡阵容
        for (let index = 0; index < detail.y21_metaphase_heros.length; index++) {
            let chess = detail.y21_metaphase_heros[index]
            let hero = this.getHeroById(chess.hero_id)

            let equipment_id = chess.equipment_id ? chess.equipment_id.split(',') : []

            let equipment = []
            if (equipment_id.length > 0 && +equipment_id[0]) {
                equipment_id.forEach(function (element) {
                    equipment.push(this.getEquidById(element))
                }.bind(this));
            }
            let equment_dom = ''
            if (equipment) {
                for (let equment_index = 0; equment_index < equipment.length; equment_index++) {
                    const element = equipment[equment_index]
                    equment_dom += common.sprintf(set5_dom.raceChessDSortHeroEquipList, element.equipId, element.imagePath.replace(/^https?:/, ''))
                }
            }
            output_y21_metaphase_heros += common.sprintf(set5_dom.raceChessDSortHeroList, hero.price, this.getHeroAvatar(hero.name), hero.chessId, equment_dom)
        }
        // 主c英雄 & 备选英雄
        let hero_replace_inner_html = ''
        for (let x = 0; x < detail.hero_replace.length; x++) {
            let val = detail.hero_replace[x]
            main_hero_ids = val.hero_id.match(/\d+/g)
            replace_hero_ids = val.replace_heros.match(/\d+/g)
            let tmp_main_hero_dom = ''
            let tmp_replace_hero_dom = ''
            for (let z = 0; z < main_hero_ids.length; z++) {
                let main_hero = this.getHeroById(main_hero_ids[z])
                tmp_main_hero_dom += common.sprintf(set5_dom.raceChessDSortHeroList, main_hero.price, this.getHeroAvatar(main_hero.name), main_hero.chessId, '')
            }
            for (let z = 0; z < replace_hero_ids.length; z++) {
                let replace_hero = this.getHeroById(replace_hero_ids[z])
                tmp_replace_hero_dom += common.sprintf(set5_dom.raceChessDSortHeroList, replace_hero.price, this.getHeroAvatar(replace_hero.name), replace_hero.chessId, '')
            }
            hero_replace_inner_html += common.sprintf(set5_dom.raceChessDSortHeroListSplit, tmp_main_hero_dom, tmp_replace_hero_dom)
        }
        let innerHtml = common.sprintf(set5_dom.raceChessDSort, output_y21_early_heros, detail.y21_metaphase_heros.length ? '' : 'hidden', output_y21_metaphase_heros, !detail.hero_replace || !detail.hero_replace.length ? 'hidden' : '', hero_replace_inner_html)
        $(div).find('.interim-box').html(innerHtml)
    }
    this.initTransJobRace = function (div, detail) {// 过渡羁绊
        let raceJobListInnerHTML1 = ''
        let raceJobListInnerHTML2 = ''
        detail.y21_early_heros_contact.forEach(function (element) { //前期羁绊
            let race_job // 根据type获取羁绊对象 type = race || job
            if (element.type === 'race') {
                race_job = this.getRaceById(element.id)
                if (!(element.color < 5)) {
                    try {
                        element.color = handleColor(race_job.race_color_list, element.num)
                    } catch (error) {
                        console.error('羁绊color获取失败:', error)
                    }
                }
            } else if (element.type === 'job') {
                race_job = this.getJobById(element.id)
                if (!(element.color < 5)) {
                    try {
                        element.color = handleColor(race_job.job_color_list, element.num)
                    } catch (error) {
                        console.error('职业color获取失败:', error)
                    }
                }
            }
            if (race_job) {
                raceJobListInnerHTML1 += common.sprintf(set5_dom.transJobRaceList, element.type, element.id, element.color, race_job.imagePath.replace(/^https?:/, ''), element.num, race_job.name)
            }
        }.bind(this))
        raceJobListInnerHTML1 = raceJobListInnerHTML1 ? common.sprintf(set5_dom.transJobRaceFront, raceJobListInnerHTML1) : ''
        detail.y21_metaphase_heros_contact.forEach(function (element) { //中期羁绊
            let race_job // 根据type获取羁绊对象 type = race || job
            if (element.type === 'race') {
                race_job = this.getRaceById(element.id)
                if (!(element.color < 5)) {
                    try {
                        element.color = handleColor(race_job.race_color_list, element.num)
                    } catch (error) {
                        console.error('羁绊color获取失败:', error)
                    }
                }
            } else if (element.type === 'job') {
                race_job = this.getJobById(element.id)
                if (!(element.color < 5)) {
                    try {
                        element.color = handleColor(race_job.job_color_list, element.num)
                    } catch (error) {
                        console.error('职业color获取失败:', error)
                    }
                }
            }
            if (race_job) {
                raceJobListInnerHTML2 += common.sprintf(set5_dom.transJobRaceList, element.type, element.id, element.color, race_job.imagePath.replace(/^https?:/, ''), element.num, race_job.name)
            }
        }.bind(this))
        raceJobListInnerHTML2 = raceJobListInnerHTML2 ? common.sprintf(set5_dom.transJobRaceMiddle, raceJobListInnerHTML2) : ''
        if (!detail.y21_early_heros_contact.length) {
            raceJobListInnerHTML1 = ''
        }
        if (!detail.y21_metaphase_heros_contact.length) {
            raceJobListInnerHTML2 = ''
        }
        let innerHtml = common.sprintf(set5_dom.transJobRace, raceJobListInnerHTML1, raceJobListInnerHTML2)
        $(div).find('.transit-job').html(innerHtml)
        if (!detail.y21_early_heros_contact.length && !detail.y21_metaphase_heros_contact.length) {
            $(div).find('.transit-job').remove()
        }

    }
    this.initRaceEquitSort = function (div, detail) { // 装备优先级
        let chess = detail.hero_location.find(function (x) { return +x.is_carry_hero })
        let hero = chess ? this.getHeroById(chess.hero_id) : false
        // 获取装备id数组
        // let equip_main_ids = detail.carry_hero_equip_replace.main.split(',')
        //let equip_backup_ids = detail.carry_hero_equip_replace.backup.split(',')
        let equip_main_ids
        let equip_backup_ids
        let equip_radiant_ids
        try {
            equip_main_ids = detail.carry_hero_equip_replace.main.split(',')
        } catch (e) {
            equip_main_ids = []
        }
        try {
            equip_backup_ids = detail.carry_hero_equip_replace.backup.split(',')
        } catch (e) {
            equip_backup_ids = []
        }

        try {
            equip_radiant_ids = detail.radiant_equip_list.split(',')
        } catch (e) {
            equip_radiant_ids = []
        }

        let equip_sort_ids = detail.equipment_order.split(',')
        // 获取装备列表对象
        let equip_main = [] // 必备装备
        let equip_backup = [] // 备选装备
        let equip_radiant = [] // 光明装备
        let equip_sort = [] // 抢装顺序
        if (equip_main_ids.length > 0 && +equip_main_ids[0]) {
            equip_main_ids.forEach(function (element) {
                equip_main.push(this.getEquidById(element))
            }.bind(this));
        }
        if (equip_backup_ids.length > 0 && +equip_backup_ids[0]) {
            equip_backup_ids.forEach(function (element) {
                equip_backup.push(this.getEquidById(element))
            }.bind(this));
        }

        if (equip_radiant_ids.length > 0 && +equip_radiant_ids[0]) {
            equip_radiant_ids.forEach(function (element) {
                equip_radiant.push(this.getEquidById(element))
            }.bind(this));
        }

        if (equip_sort_ids.length > 0 && +equip_sort_ids[0]) {
            equip_sort_ids.forEach(function (element) {
                equip_sort.push(this.getEquidById(element))
            }.bind(this));
        }

        // 获取装备列表document结构
        let equip_main_inner_html = []
        let equip_backup_inner_html = []
        let equip_radiant_inner_html = []
        let equip_sort_inner_html = []
        equip_main.forEach(function (element) {
            if (element) {
                equip_main_inner_html.push(common.sprintf(set5_dom.raceEquitSortEquipList, element.equipId, element.imagePath.replace(/^https?:/, '')))
            }
        }.bind(this))
        equip_backup.forEach(function (element) {
            if (element) {
                equip_backup_inner_html.push(common.sprintf(set5_dom.raceEquitSortEquipList, element.equipId, element.imagePath.replace(/^https?:/, '')))
            }
        }.bind(this))
        equip_radiant.forEach(function (element) {
            if (element) {
                equip_radiant_inner_html.push(common.sprintf(set5_dom.raceEquitSortEquipList, element.equipId, element.imagePath.replace(/^https?:/, '')))
            }
        }.bind(this))
        equip_sort.forEach(function (element) {
            if (element) {
                equip_sort_inner_html.push(common.sprintf(set5_dom.raceEquitSortEquipList, element.equipId, element.imagePath.replace(/^https?:/, '')))
            }
        }.bind(this))
        // 加上箭头
        equip_main_inner_html = equip_main_inner_html.join('<i class="order-icon"></i>')
        equip_backup_inner_html = equip_backup_inner_html.join('<i class="order-icon"></i>')
        equip_radiant_inner_html = equip_radiant_inner_html.join('<i class="order-icon"></i>')
        // equip_sort_inner_html = equip_sort_inner_html.join('<i class="order-icon"></i>')
        // 包上外框
        equip_main_inner_html = equip_main_inner_html ? common.sprintf(set5_dom.raceEquitSortMainEquip, equip_main_inner_html) : ''
        equip_backup_inner_html = equip_backup_inner_html ? common.sprintf(set5_dom.raceEquitSortBackupEquip, equip_backup_inner_html) : ''
        equip_radiant_inner_html = equip_radiant_inner_html ? common.sprintf(set5_dom.raceEquitSortRadiantEquip, equip_radiant_inner_html) : ''
        equip_sort_inner_html = equip_sort_inner_html ? common.sprintf(set5_dom.raceEquitSortEquip, equip_sort_inner_html) : ''
        // 渲染dom
        let innerHtml = common.sprintf(set5_dom.raceEquitSort, hero.price, this.getHeroAvatar(hero.name), hero.chessId, equip_main_inner_html + equip_backup_inner_html + equip_sort_inner_html + equip_radiant_inner_html)
        $(div).find('.order-box').html(innerHtml)
    }
    this.initRaceChessPosition = function (div, detail) { // 比赛阵容
        let RaceChessPositionForent = this.initRaceChessPositionForent(detail)
        let RaceChessPositionMiddle = this.initRaceChessPositionMiddle(detail)
        let RaceChessPositionEnd = this.initRaceChessPositionEnd(detail)
        let innerHtml = common.sprintf(set5_dom.raceChessPosition, RaceChessPositionForent + RaceChessPositionMiddle + RaceChessPositionEnd)
        $(div).find('.position-box').html(innerHtml)
    }
    this.positionTransform = function (position) {
        if (!position) return ''
        arr = position.split(',')
        if (arr.length != 2)
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] < 1 || arr[i] > 7 || parseInt(arr[i]) != arr[i]) {
                    return false
                }
            }
        return arr.join('-')
    }
    this.initRaceChessPositionForent = function (detail) { // 比赛前期阵容
        herosInnerHtml = ''
        detail.y21_early_heros.forEach(function (element) {
            let hero = this.getHeroById(element.hero_id)
            let position = this.positionTransform(element.location)
            if (position) {
                herosInnerHtml += common.sprintf(set5_dom.raceChessPositionHero, position, this.getHeroAvatar(hero.name), hero.chessId)
            }
        }.bind(this))
        let innerHtml = ''
        let hero = {}
        innerHtml = common.sprintf(set5_dom.raceChessPositionForent, herosInnerHtml)
        return innerHtml
    }
    this.initRaceChessPositionMiddle = function (detail) { // 比赛中期阵容
        herosInnerHtml = ''
        detail.y21_metaphase_heros.forEach(function (element) {
            let hero = this.getHeroById(element.hero_id)
            let position = this.positionTransform(element.location)
            if (position) {
                herosInnerHtml += common.sprintf(set5_dom.raceChessPositionHero, position, this.getHeroAvatar(hero.name), hero.chessId)
            }
        }.bind(this))
        let innerHtml = ''
        let heros = {}
        innerHtml = common.sprintf(set5_dom.raceChessPositionMiddle, herosInnerHtml)
        return innerHtml
    }
    this.initRaceChessPositionEnd = function (detail) { // 比赛后期阵容
        let herosInnerHtml = ''
        let herosInnerHtml2 = ''
        let position2_list_sum = 0
        detail.hero_location.forEach(function (element) {
            let hero = this.getHeroById(element.hero_id)
            if (!hero) {
                return
            }
            let position = this.positionTransform(element.location)
            if (position) {
                herosInnerHtml += common.sprintf(set5_dom.raceChessPositionHero, position, this.getHeroAvatar(hero.name), hero.chessId)
            }
            let position2 = this.positionTransform(element.location_2)
            if (position2) {
                position2_arr = element.location_2.split(',')
                if (position2_arr.length === 2) {
                    position2_arr[0] = parseInt(position2_arr[0])
                    position2_arr[1] = parseInt(position2_arr[1])
                    position2_list_sum += (position2_arr[0] - 1) * 7 + position2_arr[1]
                }
                herosInnerHtml2 += common.sprintf(set5_dom.raceChessPositionHero, position2, this.getHeroAvatar(hero.name), hero.chessId)
            }
        }.bind(this))
        let innerHtml = ''
        let sumLimit = 0
        for (let x = 1; x < detail.hero_location.length + 1; x++) {
            sumLimit += x
        }
        if ((!position2_list_sum || sumLimit == position2_list_sum) && !detail.location_info_2) {
            innerHtml = common.sprintf(set5_dom.raceChessPositionEndLoney, detail.location_info, herosInnerHtml)
        } else {
            innerHtml = common.sprintf(set5_dom.raceChessPositionEnd, detail.location_info, detail.location_info_2, herosInnerHtml, herosInnerHtml2)
        }
        return innerHtml
    }
    this.init = function () {
        let t = setInterval(function () {
            if (set5_request.queryNum === 6) {
                clearInterval(t)
                this.initList()
            }
        }.bind(this), 80)
    }
    this.init()
})

function handleColor (str, k) {
    const startI = str.indexOf(k + ':')
    if (startI > -1) {
        return str.slice(startI + 2, startI + 3)
    }
    return 4
}