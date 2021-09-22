# bss-range-slider
Bootstrap Style Multi-Range Slider

Licence: MIT Licence <br>
full use free of charge
<br><br>
### Usage:
html: <br>
```html
<div class="bs-multi-range">
    <div class="track">
        <div class="thumb upper"></div>
           <div class="thumb lower"></div>
        <div class="track-diff"></div>
    </div>
</div>
```

(track-diff is optional)

js: 

```typescript
const DoubleSlider = require("bootstrap-double-slider")
new DoubleSlider(el: HTMLElement | string, min: number, 
    max: number, thumbSize: number, autoUpdate: boolean, emitEvents: boolean)
```

#### min, max: position the sliders are at initialisation (in percent) (default 0, 100)
#### thumbSize: only modify when overwriting the --thumb-size css variable and set it to the value in px (default: 16)
#### autoUpdate: if set to true (default) the boundingClientRect gets updated every time values are changed (via drag/mouse or programmatically doesn't matter). Only set to false if you are sure your element never changes
#### emitEvents: if set to true (default) a "change" event gets emitted
