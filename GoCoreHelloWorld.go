package main

import (
	"github.com/DanielRenne/GoCore/core/app"
	_ "github.com/DanielRenne/GoCoreHelloWorld/webAPIs/v1/webAPI"
)

func main() {
	//Run First.
	app.Initialize("src/github.com/DanielRenne/GoCoreHelloWorld", "mywebsite.com")

	//Add your Application Code here.

	//Run Last.
	app.Run()
}
