var DoubleSlider = (function () {
    function DoubleSlider(el, min, max, sliderWidth) {
        var _this = this;
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 100; }
        if (sliderWidth === void 0) { sliderWidth = 16; }
        this.min = min;
        this.max = max;
        this.sliderWidth = sliderWidth;
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
    }
    DoubleSlider.prototype.mousePercent = function () {
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
        this.el.dispatchEvent(new CustomEvent("change", { detail: { target: this } }));
    };
    DoubleSlider.prototype.updateDiff = function () {
        if (!this.diff)
            return;
        this.diff.style.left = this.min + "%";
        this.diff.style.width = this.max - this.min + "%";
    };
    return DoubleSlider;
}());
var Thumb = (function () {
    function Thumb(el, parent) {
        var _this = this;
        this.percent = 0;
        this.interval = 0;
        if (!el)
            throw new Error("Thumb was undefined");
        this.parent = parent;
        this.el = el;
        this.el.addEventListener("mousedown", function () {
            _this.interval = setInterval(function () {
                _this.drag();
            }, 2);
        });
    }
    Thumb.prototype.drag = function () {
        this.setPercent(this.parent.mousePercent());
    };
    Thumb.prototype.setPercent = function (percent, update) {
        if (update === void 0) { update = true; }
        this.percent = percent;
        this.el.style.left = "calc(" + percent + "%" + " - " + this.parent.sliderWidth / 2 + "px)";
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
    return Thumb;
}());
//# sourceMappingURL=doubleSlider.js.map