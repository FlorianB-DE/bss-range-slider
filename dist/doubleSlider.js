var DoubleSlider = (function () {
    function DoubleSlider(el, min, max, sliderWidth, autoUpdate, emitEvents) {
        var _this = this;
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 100; }
        if (sliderWidth === void 0) { sliderWidth = 16; }
        if (autoUpdate === void 0) { autoUpdate = true; }
        if (emitEvents === void 0) { emitEvents = true; }
        this.min = min;
        this.max = max;
        this.sliderWidth = sliderWidth;
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
        this.sliderMin = new DoubleSlider.Thumb(this.el.querySelector(".lower"), this);
        this.sliderMax = new DoubleSlider.Thumb(this.el.querySelector(".upper"), this);
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
    DoubleSlider.Thumb = (function () {
        function class_1(el, parent) {
            var _this = this;
            this.percent = 0;
            this.interval = 0;
            if (!el)
                throw new Error("Thumb was undefined");
            this.parent = parent;
            this.el = el;
            this.el.addEventListener("mousedown", function (event) {
                event.preventDefault();
                event.stopPropagation();
                _this.interval = setInterval(function () {
                    _this.drag();
                }, 2);
            });
        }
        class_1.prototype.setPercent = function (percent, update) {
            if (update === void 0) { update = true; }
            this.percent = percent;
            this.el.style.left = "calc(" + percent + "%" + " - " + this.parent.sliderWidth / 2 + "px)";
            if (!update)
                return;
            this.parent.change();
        };
        class_1.prototype.getPercent = function () {
            return this.percent;
        };
        class_1.prototype.stopDrag = function () {
            if (!this.interval)
                return;
            clearInterval(this.interval);
            this.interval = 0;
        };
        class_1.prototype.drag = function () {
            this.setPercent(this.parent.mousePercent());
        };
        return class_1;
    }());
    return DoubleSlider;
}());
//# sourceMappingURL=doubleSlider.js.map