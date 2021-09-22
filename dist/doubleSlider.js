"use strict";
exports.__esModule = true;
var DoubleSlider = (function () {
    function DoubleSlider(el, min, max, thumbSize, autoUpdate, emitEvents) {
        var _this = this;
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 100; }
        if (thumbSize === void 0) { thumbSize = 16; }
        if (autoUpdate === void 0) { autoUpdate = true; }
        if (emitEvents === void 0) { emitEvents = true; }
        this.min = min;
        this.max = max;
        this.thumbSize = thumbSize;
        this.autoUpdate = autoUpdate;
        this.emitEvents = emitEvents;
        if (typeof el === "string")
            this.el = document.querySelector(el);
        else
            this.el = el;
        if (!this.el)
            throw new Error("Element was undefined");
        var boundingClientRect = this.el.getBoundingClientRect();
        this.width = boundingClientRect.width;
        this.x = boundingClientRect.x;
        this.sliderMin = new Thumb(this.el.querySelector(".lower"), this);
        this.sliderMax = new Thumb(this.el.querySelector(".upper"), this);
        this.sliderMin.setPercent(min);
        this.sliderMax.setPercent(max);
        this.diff = this.el.querySelector(".track-diff");
        window.addEventListener("mousemove", function (event) { return _this.mouseX = event.x; });
        window.addEventListener("mouseup", function () {
            _this.sliderMin.stopDrag();
            _this.sliderMax.stopDrag();
        });
        window.addEventListener("touchmove", function (event) {
            event = (typeof event.originalEvent === "undefined") ? event : event.originalEvent;
            var touch = event.touches[0] || event.changedTouches[0];
            if (!touch)
                return;
            _this.mouseX = touch.pageX;
        });
        window.addEventListener("touchend", function () {
            _this.sliderMin.stopDrag();
            _this.sliderMax.stopDrag();
        });
        this.updateDiff();
    }
    DoubleSlider.prototype.mousePercent = function () {
        if (this.autoUpdate) {
            var newBoundingClientRect = this.el.getBoundingClientRect();
            this.x = newBoundingClientRect.x;
            this.width = newBoundingClientRect.width;
        }
        var val = ((this.mouseX - this.x) / this.width) * 100;
        if (val < 0)
            return 0;
        if (val > 100)
            return 100;
        return val;
    };
    DoubleSlider.prototype.change = function () {
        var newMin = this.sliderMin.getPercent(), newMax = this.sliderMax.getPercent();
        if (newMax - newMin - 1 <= 0) {
            this.sliderMin.setPercent(this.min, false);
            this.sliderMax.setPercent(this.max, false);
            return;
        }
        this.min = newMin;
        this.max = newMax;
        this.updateDiff();
        if (!this.emitEvents)
            return;
        this.el.dispatchEvent(new CustomEvent("change", { detail: { target: this } }));
    };
    DoubleSlider.prototype.getMin = function () {
        return this.min;
    };
    DoubleSlider.prototype.getMax = function () {
        return this.max;
    };
    DoubleSlider.prototype.setMin = function (num) {
        if (num === void 0) { num = 0; }
        if (num >= this.max)
            return;
        this.min = num;
        this.sliderMin.setPercent(this.min);
        this.change();
    };
    DoubleSlider.prototype.setMax = function (num) {
        if (num === void 0) { num = 0; }
        if (num <= this.min)
            return;
        this.max = num;
        this.sliderMax.setPercent(this.max);
        this.change();
    };
    DoubleSlider.prototype.updateDiff = function () {
        if (!this.diff)
            return;
        this.diff.style.left = this.min + "%";
        this.diff.style.width = this.max - this.min + "%";
    };
    return DoubleSlider;
}());
exports["default"] = DoubleSlider;
var Thumb = (function () {
    function Thumb(el, parent) {
        var _this = this;
        this.percent = 0;
        this.interval = 0;
        if (!el)
            throw new Error("Thumb was undefined");
        this.parent = parent;
        this.el = el;
        this.el.addEventListener("mousedown", function (event) { return _this.update(event); });
        this.el.addEventListener("touchstart", function (event) { return _this.update(event); });
    }
    Thumb.prototype.update = function (event) {
        var _this = this;
        event.preventDefault();
        event.stopPropagation();
        this.interval = setInterval(function () {
            _this.drag();
        }, 2);
    };
    Thumb.prototype.setPercent = function (percent, update) {
        if (update === void 0) { update = true; }
        this.percent = percent;
        this.el.style.left = "calc(" + percent + "%" + " - " + this.parent.thumbSize / 2 + "px)";
        if (!update)
            return;
        this.parent.change();
    };
    Thumb.prototype.getPercent = function () {
        return this.percent;
    };
    Thumb.prototype.stopDrag = function () {
        if (!this.interval)
            return;
        clearInterval(this.interval);
        this.interval = 0;
    };
    Thumb.prototype.drag = function () {
        this.setPercent(this.parent.mousePercent());
    };
    return Thumb;
}());
//# sourceMappingURL=doubleSlider.js.map