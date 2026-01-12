import {fetch} from "scripting";

class API {
    private KEY = "airport";
    title:string =""
    url = ""
    reset_day = 1;
    method = "head";
    ua = "Loon";

    constructor() {
        Object.assign(this, Storage.get(this.KEY));
    }

    async save() {
        return Storage.set(this.KEY, {
            title: this.title,
            url: this.url,
            reset_day: this.reset_day,
            method: this.method,
            ua: this.ua
        });
    }
    async getUsage() {
        const info = await this.getDataInfo(this.url)
        if (!info) return

        const resetDayLeft = this.getRemainingDays(this.reset_day)

        const used = info.download + info.upload
        const total = info.total
        const expire = info.expire

        const now = new Date()
        const hour = String(now.getHours()).padStart(2, "0")
        const minute = String(now.getMinutes()).padStart(2, "0")

        return {
            max:total,
            used:used,
            expire
        }
    }

    async getUserInfo(url: string) {
        const method = this.method

        const res = await fetch(url, {
            method,
            headers: {
                "User-Agent": this.ua ,
            },
        })

        if (!res) {
            throw new Error("请求失败")
        }

        if (res.status !== 200) {
            throw new Error(`HTTP 状态码异常: ${res.status}`)
        }

        // scripting / fetch 返回的是 Headers 对象
        let userInfo: string | null = null

        for (const [key, value] of res.headers.entries()) {
            if (key.toLowerCase() === "subscription-userinfo") {
                userInfo = value
                break
            }
        }

        if (userInfo) {
            return userInfo
        }

        throw new Error("链接响应头不带有流量信息")
    }

    async getDataInfo(url: string) {
        let data: string

        try {
            data = await this.getUserInfo(url)
        } catch (err) {
            console.log("获取 subscription-userinfo 失败:", String(err))
            return null
        }

        // subscription-userinfo 示例：
        // upload=123; download=456; total=789; expire=1700000000

        const matches = data.match(/\w+=[\d.eE+-]+/g)
        if (!matches) {
            console.log("subscription-userinfo 格式异常:", data)
            return null
        }

        return Object.fromEntries(
            matches.map(item => {
                const [k, v] = item.split("=")
                return [k, Number(v)]
            })
        )
    }

    getRemainingDays(resetDay: number) {
        if (!resetDay || resetDay < 1 || resetDay > 31) return null

        const now = new Date()
        const today = now.getDate()
        const year = now.getFullYear()
        const month = now.getMonth()

        // 本月的重置日
        let resetDate = new Date(year, month, resetDay)

        // 如果本月已过重置日，算下个月
        if (today > resetDay) {
            resetDate = new Date(year, month + 1, resetDay)
        }

        const diff = resetDate.getTime() - now.getTime()
        return Math.ceil(diff / (1000 * 60 * 60 * 24))
    }


}

export const api = new API();
