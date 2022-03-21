package main

import (
	"github.com/luxiaolan6373/lw"
	"context"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
)

var as  *AutoShop

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (b *App) startup(ctx context.Context) {
	// Perform your setup here
	b.ctx = ctx
}

// domReady is called after the front-end dom has been loaded
func (b *App) domReady(ctx context.Context) {
	// Add your action here
	com, err := lw.New()
	if err != nil {
		panic("注册失败")
		return
	} else {
		as = NewAutoShop(com)
		as.Start()
	}



}

// shutdown is called at application termination
func (b *App) shutdown(ctx context.Context) {
	// Perform your teardown here



}

// Greet returns a greeting for the given name
func (b *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Greet return 当前的阵容数据
func (b *App) GetCurrentDate(data []string){
	//更新阵容数据
	as.chess_list = data
	text:=""
	for _, i2 := range data {
		text+=i2+"|"
	}
	//flag说明  O_WRONLY 只写方式 O_CREATE 如果不存在文件则创建 O_TRUNC 截断之前的内容 也就是不加载之前的内容
	f,err:=os.OpenFile("./cheseLsit.txt",os.O_WRONLY | os.O_CREATE | os.O_TRUNC ,0600)
	defer f.Close()
	if err != nil {
		fmt.Println(err.Error())
	} else {
		runtime.WindowSetTitle(b.ctx,"TFTGO阵容推荐 QQ技术交流群952120925 "+text)
		print(text)
		f.Write([]byte(text))
	}
}



