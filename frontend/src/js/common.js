window.common = new (function () {
    this.sprintf = function () {
        let args = arguments, string = args[0];
        for (let i = 1; i < args.length; i++) {
            let item = arguments[i];
            string = string.replace('%s', item);
        }
        return string;
    }
    this.inArray = function (needle, array) {
        if (array) {
            for (let index = 0; index < array.length; index++) {
                const element = array[index]
                if (needle === element) return true
            }
        }
        return false
    }
})
Array.prototype.myForEach = function myForEach(callBack, context) {
    typeof context === "undefined" ? context = window : null;

    if ("forEach" in Array.prototype) {
        this.forEach(callBack, context);
        return;
    }

    //->涓嶅吋瀹瑰鐞?
    for (var i = 0; i < this.length; i++) {
        typeof callBack === "function" ? callBack.call(context, this[i], i, this) : null;
    }
};