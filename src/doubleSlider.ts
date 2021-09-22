export default class DoubleSlider {

    public readonly thumbSize: number
    public readonly el: HTMLElement
    private readonly autoUpdate: boolean

    private readonly diff: HTMLElement | null
    private readonly sliderMin: Thumb
    private readonly sliderMax: Thumb
    private emitEvents: boolean
    private min: number
    private max: number
    private width: number
    private x: number
    private mouseX: number


    constructor(el: string | HTMLElement, min = 0, max = 100, thumbSize = 16,
                autoUpdate = true, emitEvents = true, clickTrack = true) {
        this.min = min
        this.max = max
        this.thumbSize = thumbSize
        this.autoUpdate = autoUpdate
        this.emitEvents = emitEvents

        if (typeof el === "string") this.el = document.querySelector(el)
        else this.el = el
        if (!this.el) throw new Error("Element was undefined")

        if (clickTrack) {
            const track = this.el.querySelector(".track") as HTMLElement | null
            if (!track) throw new Error("track was null!")
            track.style.cursor = "pointer"

            const handler = (position: number) => {
                this.mouseX = position
                const percent = this.mousePercent(),
                    thumb = Math.abs(this.sliderMin.getPercent() - percent) <= Math.abs(this.sliderMax.getPercent() - percent)
                        ? this.sliderMin
                        : this.sliderMax
                thumb.setPercent(percent)
            }

            track.addEventListener("click", event => handler(event.x))
            track.addEventListener("touchend", event => handler(DoubleSlider.getTouchPosition(event)))
        }

        const boundingClientRect = this.el.getBoundingClientRect()
        this.width = boundingClientRect.width
        this.x = boundingClientRect.x

        this.sliderMin = new Thumb(this.el.querySelector(".lower"), this)
        this.sliderMax = new Thumb(this.el.querySelector(".upper"), this)

        this.sliderMin.setPercent(min)
        this.sliderMax.setPercent(max)

        this.diff = this.el.querySelector(".track-diff")

        const dragEnd = () => {
            this.sliderMin.stopDrag()
            this.sliderMax.stopDrag()
        }

        window.addEventListener("mousemove", event => this.mouseX = event.x)
        window.addEventListener("mouseup", dragEnd)

        // for explanation see https://stackoverflow.com/questions/41993176/determine-touch-position-on-tablets-with-javascript/61732450#61732450
        window.addEventListener("touchmove", event => this.mouseX = DoubleSlider.getTouchPosition(event))
        window.addEventListener("touchend", dragEnd)

        this.updateDiff()
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

    public change(overrideEmit = false): void {
        const newMin = this.sliderMin.getPercent(), newMax = this.sliderMax.getPercent()
        if (newMax - newMin - 1 <= 0) {
            this.sliderMin.setPercent(this.min, false)
            this.sliderMax.setPercent(this.max, false)
            return
        }
        this.min = newMin
        this.max = newMax
        this.updateDiff()
        if (!this.emitEvents || overrideEmit) return;
        this.el.dispatchEvent(new CustomEvent("change", {detail: {target: this}}))
    }

    public getMin(): number {
        return this.min
    }

    public getMax(): number {
        return this.max
    }

    public setMin(num = 0, emit = true) {
        if (num >= this.max) return
        this.min = num
        this.sliderMin.setPercent(this.min)
        this.change(!emit)
    }

    public setMax(num = 0, emit = true) {
        if (num <= this.min) return
        this.max = num
        this.sliderMax.setPercent(this.max)
        this.change(!emit)
    }

    private updateDiff(): void {
        if (!this.diff) return

        this.diff.style.left = this.min + "%"
        this.diff.style.width = this.max - this.min + "%"
    }

    private static getTouchPosition(event: TouchEvent) : number {
        // @ts-ignore
        event = (typeof event.originalEvent === "undefined") ? event : event.originalEvent
        const touch = event.touches[0] || event.changedTouches[0]
        if (!touch) return -1
        return touch.pageX
    }
}

class Thumb {

    public readonly el: HTMLElement

    private percent = 0
    private interval = 0
    private readonly parent: DoubleSlider

    constructor(el: HTMLElement | null, parent: DoubleSlider) {
        if (!el) throw new Error("Thumb was undefined")

        this.parent = parent

        this.el = el
        this.el.addEventListener("mousedown", event => this.update(event))
        this.el.addEventListener("touchstart", event => this.update(event))
    }

    private update(event: Event) : void {
        event.preventDefault()
        event.stopPropagation()
        // @ts-ignore
        this.interval = setInterval(() => {
            this.drag()
        }, 2)
    }

    public setPercent(percent: number, update = true) {
        this.percent = percent
        this.el.style.left = "calc(" + percent + "%" + " - " + this.parent.thumbSize / 2 + "px)"
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