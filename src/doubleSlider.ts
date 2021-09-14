class DoubleSlider {
    public readonly sliderWidth: number
    public readonly el: HTMLElement
    private readonly autoUpdate: boolean
    private readonly emitEvents: boolean
    private readonly diff: HTMLElement | null
    private min: number
    private max: number
    private width: number
    private x: number
    private mouseX: number
    // @ts-ignore
    private sliderMin: DoubleSlider.Thumb
    // @ts-ignore
    private sliderMax: DoubleSlider.Thumb


    constructor(el: string | HTMLElement, min = 0, max = 100, sliderWidth = 16, autoUpdate = true, emitEvents = true) {
        this.min = min
        this.max = max
        this.sliderWidth = sliderWidth
        this.autoUpdate = autoUpdate
        this.emitEvents = emitEvents

        if (typeof el === "string") this.el = document.querySelector(el)
        else this.el = el
        if (!this.el) throw new Error("Element was undefined")

        const boundingClientRect = this.el.getBoundingClientRect()
        this.width = boundingClientRect.width
        this.x = boundingClientRect.x

        this.sliderMin = new DoubleSlider.Thumb(this.el.querySelector(".lower"), this)
        this.sliderMax = new DoubleSlider.Thumb(this.el.querySelector(".upper"), this)

        this.sliderMin.setPercent(min)
        this.sliderMax.setPercent(max)

        this.diff = this.el.querySelector(".track-diff")

        window.addEventListener("mousemove", event => this.mouseX = event.x)
        window.addEventListener("mouseup", () => {
            this.sliderMin.stopDrag()
            this.sliderMax.stopDrag()
        })
    }

    public mousePercent(): number {
        if (this.autoUpdate) {
            const newBoundingClientRect = this.el.getBoundingClientRect()
            this.x = newBoundingClientRect.x
            this.width = newBoundingClientRect.width
        }
        const val = ((this.mouseX - this.x) / this.width) * 100
        if (val < 0) return 0
        if (val > 100) return 100
        return val
    }

    public change(): void {
        const newMin = this.sliderMin.getPercent(), newMax = this.sliderMax.getPercent()
        if (newMax - newMin - 1 <= 0) {
            this.sliderMin.setPercent(this.min, false)
            this.sliderMax.setPercent(this.max, false)
            return
        }
        this.min = newMin
        this.max = newMax
        this.updateDiff()
        if (!this.emitEvents) return;
        this.el.dispatchEvent(new CustomEvent("change", {detail: {target: this}}))
    }

    public getMin(): number {
        return this.min
    }

    public getMax(): number {
        return this.max
    }

    public setMin(num = 0) {
        if (num >= this.max) return
        this.min = num
        this.sliderMin.setPercent(this.min)
        this.change()
    }

    public setMax(num = 0) {
        if (num <= this.min) return
        this.max = num
        this.sliderMax.setPercent(this.max)
        this.change()
    }

    private updateDiff(): void {
        if (!this.diff) return

        this.diff.style.left = this.min + "%"
        this.diff.style.width = this.max - this.min + "%"
    }
    static Thumb = class {
    public readonly el: HTMLElement

    private percent = 0
    private interval = 0
    private readonly parent: DoubleSlider

    constructor(el: HTMLElement | null, parent: DoubleSlider) {
        if (!el) throw new Error("Thumb was undefined")

        this.parent = parent

        this.el = el
        this.el.addEventListener("mousedown", event => {
            event.preventDefault()
            event.stopPropagation()
            // @ts-ignore
            this.interval = setInterval(() => {
                this.drag()
            }, 2)
        })
    }

    public setPercent(percent: number, update = true) {
        this.percent = percent
        this.el.style.left = "calc(" + percent + "%" + " - " + this.parent.sliderWidth / 2 + "px)"
        if (!update) return
        this.parent.change()
    }

    public getPercent(): number {
        return this.percent
    }

    public stopDrag() {
        if (!this.interval) return
        clearInterval(this.interval)
        this.interval = 0
    }

    private drag() {
        this.setPercent(this.parent.mousePercent())
    }
}
}