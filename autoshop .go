package main

import (
	"github.com/luxiaolan6373/lw"
	"fmt"
	"os"
	"strings"
	"syscall"
	"time"
)
//判断两个切片是否一样 改版的，只要相似度有5成就行
func IsSplieLike(a, b []string) int {
	// If one is nil, the other must also be nil.

	sim:=0
	for i := range a {
		if a[i] == b[i] {
			sim+=1
		}
	}
	return sim
}
//判断某个值是否存在于切片中
func IsValueInList(value string, list []string) bool {
	for _, v := range list {
		if v == value {
			return true
		}
	}
	return false
}

//相当于一个类.这里放它的属性变量
type AutoShop struct {
	lw               *lw.LwSoft
	chess_list       []string //选中的棋子
	goods_pos        [][]int  //商店窗口坐标
	color_format     string   //颜色信息
	sim              float32  //相似度
	goods_chess_list []string //上一轮的商店棋子数据
}

//初始化数据
func NewAutoShop(com *lw.LwSoft) *AutoShop {
	as := new(AutoShop)
	as.lw = com
	dir, _ := os.Getwd()
	as.lw.SetShowErrorMsg(0) //设置不弹出错误窗口
	as.lw.SetPath(dir)
	fmt.Println(as.lw.SetDict(0, "字库1920_1080.txt", ""))
	//设置一些参数
	as.chess_list = []string{}
	as.color_format = "#220"
	as.sim = 0.77
	as.goods_pos = [][]int{
		{480, 1039, 632, 1071},
		{689, 1040, 844, 1072},
		{884, 1038, 1028, 1067},
		{1088, 1039, 1227, 1065},
		{1290, 1041, 1422, 1069}}
	as.goods_chess_list = make([]string, 5)
	//更新自动列表
	as.ReadCheseList()

	return as
}

//给类增加方法
//取游戏窗口句柄
func (as *AutoShop) GetGameHund() int {
	return as.lw.FindWindow("League of Legends (TM) Client", "RiotWindowClass", "", 0, 0, 0, 0, 0, 0, 0, 0, "", 0)
}

//识别一轮商店
func (as *AutoShop) OneRun() {
	chess_list:= make([]string, 5)
	fmt.Println("1",as.goods_chess_list,chess_list)
	//判断前台鼠标是否被按下
	if as.lw.GetKeyState(1)==1{
		return
	}
	if as.lw.GetKeyState(2)==1{
		return
	}
	//获取5个 位置的数据
	for i, item := range as.goods_pos {
		chess_list[i]=as.lw.Ocr(item[0], item[1], item[2], item[3], as.color_format, as.sim, "", 0)
	}
	fmt.Println("2",as.goods_chess_list,chess_list)
	//如果这次的数据和上次不一样则继续
	if IsSplieLike(chess_list,as.goods_chess_list)<2{

		for i, item := range as.goods_pos {
			if IsValueInList(chess_list[i], as.chess_list) == true {
				as.lw.LockInput(1)
				//移动鼠标
				as.lw.MoveTo(item[0]+50, item[1]-50)
				//等待100毫秒 让商店反应过来
				time.Sleep(80 * time.Millisecond)
				//单击
				as.lw.LeftClick()
				fmt.Println("帮拿:", chess_list[i])
				time.Sleep(100 * time.Millisecond)
				as.lw.LockInput(0)
			}
		}

		//将这次的数据保存起来
		copy(as.goods_chess_list,chess_list)

	}else{
		time.Sleep(500 * time.Millisecond)
	}
}

//重新加载一下阵容数据
func (as *AutoShop) ReadCheseList() {
	f, err := os.OpenFile("./cheseLsit.txt", syscall.O_RDONLY, 0600)
	defer func(f *os.File) {
		err := f.Close()
		if err != nil {
			return
		}
	}(f)
	if err != nil {
		fmt.Println(err.Error())
		return
	} else {
		buf := make([]byte, 200)
		n, err := f.Read(buf)
		if err != nil {
			fmt.Println("读取文件发生错误", err)
			return
		}
		//去掉最后一个| 以及多余的长度
		text := string(buf[0 : n-1])
		as.chess_list = strings.Split(text, "|")


	}

}

//脚本开始
func (as *AutoShop) Start() {

	var hwnd_game int
	for true {
		fmt.Println("选阵容请启动阵容查看器 点击 S或者A就可以选定阵容了")
		fmt.Println("正在寻找游戏,等待游戏启动...")
		for true {
			hwnd_game = as.GetGameHund()
			if hwnd_game != 0 {
				//绑定
				fmt.Println(as.lw.BindWindow(hwnd_game, 0, 0, 0, 0, 0))
				break
			}
			time.Sleep(5000 * time.Millisecond)
		}
		fmt.Println("成功找到游戏,等待开局...")

		for true {

			if hwnd_game == 0 {
				//解除绑定
				as.lw.UnBindWindow()
				break
			}
			//识别一轮
			as.OneRun()
			if int(time.Now().Unix())%9== 0 {
				//重新获取一下句柄
				hwnd_game = as.GetGameHund()
			}
			time.Sleep(200 * time.Millisecond)
		}

	}

}

