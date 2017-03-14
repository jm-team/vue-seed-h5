export default (Vue, Options = {}) => {
    if (!Array.prototype.remove) {
        Array.prototype.remove = function (item) {
            if (!this.length) return
            var index = this.indexOf(item)
            if (index > -1) {
                this.splice(index, 1)
                return this
            }
        }
    }

    var init = {
        lazyLoad: false
        ,default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADeCAMAAACwjs3hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZFNUU5QzBBMDIyQzExRTc5NDBDQTg1MDE4REM0NzRCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZFNUU5QzBCMDIyQzExRTc5NDBDQTg1MDE4REM0NzRCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkU1RTlDMDgwMjJDMTFFNzk0MENBODUwMThEQzQ3NEIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkU1RTlDMDkwMjJDMTFFNzk0MENBODUwMThEQzQ3NEIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz426334AAAAV1BMVEXT09Pu7u7j4+Ps7OzU1NTV1dXv7+/X19ft7e3r6+vp6enW1tbh4eHk5OTf39/d3d3q6urY2Njg4ODl5eXZ2dna2tre3t7o6Ojm5ubn5+fc3Nzw8PDS0tLPjh8WAAAEtElEQVR42uzdi3KiMBSA4YNCEi7eL90W3v85VxRblYDQFdjE/3SmnWkdOXxNYhJIkILoHAIBWGCBBRZYYEEAFlhggQUWWBCABRZYYIEFFgRggQUWWGCBBQFYYIEFFlhgQQAWWGCBBRZYEIAFFlhggQUWBGCBBRZYYIEFAVhggQUWWGBBABZYYIEFFlgQgOUOlnBeBFhgOYkl44arWGXmehEHSgWjRfxHXw7sYMk6qnzsUNshT2lArFU+RSzFxTZrGqs8PzqIFQYTYQWhe1j7fKrYO4cl259/tTHzeD5sGBOM0GoN9saLKnVzHKmPtTTVEReFq1iBHq1/val6KjNnsbIxxlOXY8isOqR7WFXm6XDDqNovtbMla1isclBT40pdx4oGGnbaIgKrcTKjlr3zWEN0p8Pj2ph4p+XhTMCqZ7y8TmbE+py/ULKa0pX4Zhi4C2/PAKzHfJO7ceAnWC1xsrqbUtQCVlOkj1MMJuTTsFslrOb6BCxrp6E+oxiD1ZBsZJkYpc3qjqXAaqqGYPXIVtmwaLPs2X7WsAwNfFPUGy1NP6sx1g9WCcOdzj2tUwcerI4DHqULz6doqimo8PiZZGH/PPY/czTryNageVayyqsNh/M10WAlve6oKl8dLuNzD8KspPAfq7TaXUvHQvrffyah/jpoeYc5+JImuzQ55bc/PcvWz2vlDUrW6ZCHa0+8/LmTfmk0yvrZZqXBi27W870aSn0KT61ek4d3WOXV0aw2Ztm8cizkDZZYx3cvurXRQyxZW25tNFRDa5s1y223x68FrDpW2LCSIJMOucibNfBJ003G22d908tfW1boeId1aF5JoluTudxiFMoblay2pQTq2b26spyrYH1orK+eYclH69qI9mTSam4mjt4A61SRniy7iMU+TDxXwc33J4OJron7Otw5Nznxk5UkCytWWe9E31TgILKm7g3WuaFZPF1389WUY6puu2fKOmfoFVbUYZXSxp7SRtmWFXo8n/W0Ep7LTGSrhhbmWegxlnRcrRlIPT9t6/Un4i2WNI5zHuNDHj8IU3vnLHksWx5Vw6TjkvDLpLy1z/A4VZHen4E/WLr7UtTsLj3dXCLV3s+SJX22LdjevE878t2lQ2+wtv32G/hOb6Oed2N9wwp77oexraZjDqrL50HV5/ICS+xTya2R7MNC0l2HV86j61l4UrJ+s2+BmpuOGzmk4lM1FJP/OlS3Jk68qYaLfMBQ38vWPcCSPl2s30bZkXV/QXnUcQD9rzEP/aiG2Tj79ehC3MeKRtpyTGn3S1b7NYpXYqm181g6HzvcxdqsweqM9aHA6ow1QYAFFlhggQUWWGCBBVYVi1xNQqVcxMomK1lb97BWk2F9uYcVmYmsjINbnMtyIqyVi49lkN0kVjsHH8twet9wNsEDPzIZsrYUA4ZOzIhPklHKJMNuqM5Div4TrCkerSXOvfn1jn45b0Quxe1XIbWvV/2qWl5n2aLa4f++swEWWGCBBRZYBFhggQUWWGARYIEFFlhggUWABRZYYIEFFgEWWGCBBRZYBFhggQUWWGARYIEFFlhggUWABRZYYIEFFgEWWGCBBRZYBFhggQUWWGARYIE1TPwVYABRKM9UXGT3WAAAAABJRU5ErkJggg=='
    }

    var listeners = [];
    var imageCache = [];

    const onListen = (ele, bind) => {
        if (bind) {
            ele.addEventListener('scroll', render)
        } else {
            init.lazyLoad = false
            ele.removeEventListener('scroll', render)
        }
    }

    const render = () => {
        for (var i=0; i<listeners.length; i++) {
            checkCanShow(listeners[i])
        }
    }

    const setEleSrc = (ele, imgSrc) => {
        ele.src = imgSrc
        ele.style.opacity = 1
        // ele.nextElementSibling.style.display = 'block'
        ele.setAttribute('load', 'success')
    }

    const alreadyLoad = (ele, imgSrc) => {
        if (imageCache.indexOf(imgSrc) > -1) {
            setEleSrc(ele, imgSrc)
            return true
        }
        return false
    }

    const checkCanShow = (item) => {
        var ele = item.ele
        var top = ele.getBoundingClientRect().top
        if (top + 10 < window.innerHeight) {
            loadImgAsync(item, (ele, imgSrc) => {
                setEleSrc(ele, imgSrc)
                imageCache.push(imgSrc)
            }, (e) => {
                console.log('image load fail')
            })
            return true
        }
        return false
    }

    const loadImgAsync = (item, resolve, reject) => {
        var img = new Image()
        img.src = item.imgSrc
        img.onload = () => {
            resolve(item.ele, item.imgSrc)
        }
        img.onerror = (e) => {
            reject(e)
        }
        listeners.remove(item)
    }

    const addListener = (ele, binding) => {
        var imgSrc = binding.value
        // ele.nextElementSibling.style.display = 'none'
        ele.setAttribute('load', 'fail')
        if (alreadyLoad(ele, imgSrc)) {
            return false
        }
        var item = {
            ele: ele,
            imgSrc: imgSrc
        }
        ele.src = init.default

        if (checkCanShow(item)) {
            return false
        }
        listeners.push(item)
        if (!init.lazyLoad) {
            init.lazyLoad = true
            onListen(window, true)
        }
    }

    Vue.directive('lazyload', addListener)
}
