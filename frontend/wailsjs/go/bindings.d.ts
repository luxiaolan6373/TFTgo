export interface go {
  "main": {
    "App": {
		GetCurrentDate(arg1:Array<string>):Promise<void>
		Greet(arg1:string):Promise<string>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
