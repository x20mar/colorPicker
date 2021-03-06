/**
 * @name ColorPicker.js
 * @author Omar Ali
 * @version 0.1.0
 * @site https://github.com/x20mar/colorPicker
 * @licence Apache Licence v2
 */

var Colors = new function()
{
    this.ColorFromHSV = function(hue, sat, val)
    {
        var color = new Color();
        color.SetHSV(hue, sat, val);
        return color;
    };

    this.ColorFromRGB = function(r, g, b)
    {
        var color = new Color();
        color.SetRGB(r, g, b);
        return color;
    };

    this.ColorFromHex = function(hexStr)
    {
        var color = new Color();
        color.SetHexString(hexStr);
        return color;
    };

    function Color()
    {
        //Stored as values between 0 and 1
        var red = 0;
        var green = 0;
        var blue = 0;

        //Stored as values between 0 and 360
        var hue = 0;

        //Strored as values between 0 and 1
        var saturation = 0;
        var value = 0;

        this.SetRGB = function(r, g, b)
        {
            if (isNaN(r) || isNaN(g) || isNaN(b))
                return false;

            r = r / 255.0;
            red = r > 1 ? 1 : r < 0 ? 0 : r;
            g = g / 255.0;
            green = g > 1 ? 1 : g < 0 ? 0 : g;
            b = b / 255.0;
            blue = b > 1 ? 1 : b < 0 ? 0 : b;

            calculateHSV();
            return true;
        };

        this.Red = function()
        {
            return Math.round(red * 255);
        };

        this.Green = function()
        {
            return Math.round(green * 255);
        };

        this.Blue = function()
        {
            return Math.round(blue * 255);
        };

        this.SetHSV = function(h, s, v)
        {
            if (isNaN(h) || isNaN(s) || isNaN(v))
                return false;

            hue = (h >= 360) ? 359.99 : (h < 0) ? 0 : h;
            saturation = (s > 1) ? 1 : (s < 0) ? 0 : s;
            value = (v > 1) ? 1 : (v < 0) ? 0 : v;
            calculateRGB();
            return true;
        };

        this.Hue = function()
        {
            return hue;
        };

        this.Saturation = function()
        {
            return saturation;
        };

        this.Value = function()
        {
            return value;
        };

        this.SetHexString = function(hexString)
        {
            if (hexString === null || typeof (hexString) !== "string")
                return false;

            if (hexString.substr(0, 1) === '#')
                hexString = hexString.substr(1);

            if (hexString.length !== 6)
                return false;

            var r = parseInt(hexString.substr(0, 2), 16);
            var g = parseInt(hexString.substr(2, 2), 16);
            var b = parseInt(hexString.substr(4, 2), 16);

            return this.SetRGB(r, g, b);
        };

        this.HexString = function()
        {
            var rStr = this.Red().toString(16);
            if (rStr.length === 1)
                rStr = '0' + rStr;
            var gStr = this.Green().toString(16);
            if (gStr.length === 1)
                gStr = '0' + gStr;
            var bStr = this.Blue().toString(16);
            if (bStr.length === 1)
                bStr = '0' + bStr;
            return ('#' + rStr + gStr + bStr).toUpperCase();
        };

        this.Complement = function()
        {
            var newHue = (hue >= 180) ? hue - 180 : hue + 180;
            var newVal = (value * (saturation - 1) + 1);
            var newSat = (value * saturation) / newVal;
            var newColor = new Color();
            newColor.SetHSV(newHue, newSat, newVal);
            return newColor;
        };

        function calculateHSV()
        {
            var max = Math.max(Math.max(red, green), blue);
            var min = Math.min(Math.min(red, green), blue);

            value = max;

            saturation = 0;
            if (max !== 0)
                saturation = 1 - min / max;

            hue = 0;
            if (min === max)
                return;

            var delta = (max - min);
            if (red === max)
                hue = (green - blue) / delta;
            else if (green === max)
                hue = 2 + ((blue - red) / delta);
            else
                hue = 4 + ((red - green) / delta);
            hue = hue * 60;
            if (hue < 0)
                hue += 360;
        }
        ;

        function calculateRGB()
        {
            red = value;
            green = value;
            blue = value;

            if (value === 0 || saturation === 0)
                return;

            var tHue = (hue / 60);
            var i = Math.floor(tHue);
            var f = tHue - i;
            var p = value * (1 - saturation);
            var q = value * (1 - saturation * f);
            var t = value * (1 - saturation * (1 - f));
            switch (i)
            {
                case 0:
                    red = value;
                    green = t;
                    blue = p;
                    break;
                case 1:
                    red = q;
                    green = value;
                    blue = p;
                    break;
                case 2:
                    red = p;
                    green = value;
                    blue = t;
                    break;
                case 3:
                    red = p;
                    green = q;
                    blue = value;
                    break;
                case 4:
                    red = t;
                    green = p;
                    blue = value;
                    break;
                default:
                    red = value;
                    green = p;
                    blue = q;
                    break;
            }
        }
    }
}
();

function Position(x, y)
{
    this.X = x;
    this.Y = y;

    this.Add = function(val)
    {
        var newPos = new Position(this.X, this.Y);
        if (val !== null)
        {
            if (!isNaN(val.X))
                newPos.X += val.X;
            if (!isNaN(val.Y))
                newPos.Y += val.Y;
        }
        return newPos;
    };

    this.Subtract = function(val)
    {
        var newPos = new Position(this.X, this.Y);
        if (val !== null)
        {
            if (!isNaN(val.X))
                newPos.X -= val.X;
            if (!isNaN(val.Y))
                newPos.Y -= val.Y;
        }
        return newPos;
    };

    this.Min = function(val)
    {
        var newPos = new Position(this.X, this.Y);
        if (val === null)
            return newPos;

        if (!isNaN(val.X) && this.X > val.X)
            newPos.X = val.X;
        if (!isNaN(val.Y) && this.Y > val.Y)
            newPos.Y = val.Y;

        return newPos;
    };

    this.Max = function(val)
    {
        var newPos = new Position(this.X, this.Y);
        if (val === null)
            return newPos;

        if (!isNaN(val.X) && this.X < val.X)
            newPos.X = val.X;
        if (!isNaN(val.Y) && this.Y < val.Y)
            newPos.Y = val.Y;

        return newPos;
    };

    this.Bound = function(lower, upper)
    {
        var newPos = this.Max(lower);
        return newPos.Min(upper);
    };

    this.Check = function()
    {
        var newPos = new Position(this.X, this.Y);
        if (isNaN(newPos.X))
            newPos.X = 0;
        if (isNaN(newPos.Y))
            newPos.Y = 0;
        return newPos;
    };

    this.Apply = function(element)
    {
        if (typeof (element) === "string")
            element = doc.getElementById(element);
        if (element === null)
            return;
        if (!isNaN(this.X))
            element.style.left = this.X + 'px';
        if (!isNaN(this.Y))
            element.style.top = this.Y + 'px';
    };
}

var doc = null;
var input = null;
var currentColor = null;

var pointerOffset = new Position(0, navigator.userAgent.indexOf("Firefox") >= 0 ? 1 : 0);
var circleOffset = new Position(5, 5);
var arrowsOffset = new Position(0, 4);

var arrowsLowBounds = new Position(0, -4);
var arrowsUpBounds = new Position(0, 251);
var circleLowBounds = new Position(-5, -5);
var circleUpBounds = new Position(250, 250);

function correctOffset(pos, offset, neg)
{
    if (neg)
        return pos.Subtract(offset);
    return pos.Add(offset);
}

function hookEvent(element, eventName, callback)
{
    if (typeof (element) === "string")
        element = doc.getElementById(element);
    if (element === null)
        return;
    if (element.addEventListener)
    {
        element.addEventListener(eventName, callback, false);
    }
    else if (element.attachEvent)
        element.attachEvent("on" + eventName, callback);
}

function unhookEvent(element, eventName, callback)
{
    if (typeof (element) === "string")
        element = doc.getElementById(element);
    if (element === null)
        return;
    if (element.removeEventListener)
        element.removeEventListener(eventName, callback, false);
    else if (element.detachEvent)
        element.detachEvent("on" + eventName, callback);
}

function cancelEvent(e)
{
    e = e ? e : window.event;
    if (e.stopPropagation)
        e.stopPropagation();
    if (e.preventDefault)
        e.preventDefault();
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;
    return false;
}

function getMousePos(eventObj)
{
    eventObj = eventObj ? eventObj : window.event;
    var pos;
    if (isNaN(eventObj.layerX))
        pos = new Position(eventObj.offsetX, eventObj.offsetY);
    else
        pos = new Position(eventObj.layerX, eventObj.layerY);
    return correctOffset(pos, pointerOffset, true);
}

function getEventTarget(e)
{
    e = e ? e : window.event;
    return e.target ? e.target : e.srcElement;
}

function absoluteCursorPostion(eventObj)
{
    eventObj = eventObj ? eventObj : window.event;

    if (isNaN(window.scrollX)) {
        return new Position(eventObj.clientX + window.pageXOffset, eventObj.clientY + window.pageYOffset);
    } else {
        return new Position(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
    }
}

function dragObject(element, attachElement, lowerBound, upperBound, startCallback, moveCallback, endCallback, attachLater)
{
    if (typeof (element) === "string")
        element = doc.getElementById(element);
    if (element === null)
        return;

    if (lowerBound !== null && upperBound !== null)
    {
        var temp = lowerBound.Min(upperBound);
        upperBound = lowerBound.Max(upperBound);
        lowerBound = temp;
    }

    var cursorStartPos = null;
    var elementStartPos = null;
    var dragging = false;
    var listening = false;
    var disposed = false;

    function dragStart(eventObj)
    {
        if (dragging || !listening || disposed)
            return;
        dragging = true;

        if (startCallback !== null)
            startCallback(eventObj, element);

        cursorStartPos = absoluteCursorPostion(eventObj);

        elementStartPos = new Position(parseInt(element.style.left), parseInt(element.style.top));

        elementStartPos = elementStartPos.Check();

        hookEvent(doc, "mousemove", dragGo);
        hookEvent(doc, "mouseup", dragStopHook);

        return cancelEvent(eventObj);
    }

    function dragGo(eventObj)
    {
        if (!dragging || disposed)
            return;

        var newPos = absoluteCursorPostion(eventObj);
        newPos = newPos.Add(elementStartPos).Subtract(cursorStartPos);
        newPos = newPos.Bound(lowerBound, upperBound);
        newPos.Apply(element);
        if (moveCallback !== null)
            moveCallback(newPos, element);

        return cancelEvent(eventObj);
    }

    function dragStopHook(eventObj)
    {
        dragStop();
        return cancelEvent(eventObj);
    }

    function dragStop()
    {
        if (!dragging || disposed)
            return;
        unhookEvent(doc, "mousemove", dragGo);
        unhookEvent(doc, "mouseup", dragStopHook);
        cursorStartPos = null;
        elementStartPos = null;
        if (endCallback !== null)
            endCallback(element);
        dragging = false;
    }

    this.Dispose = function()
    {
        if (disposed)
            return;
        this.StopListening(true);
        element = null;
        attachElement = null;
        lowerBound = null;
        upperBound = null;
        startCallback = null;
        moveCallback = null;
        endCallback = null;
        disposed = true;
    };

    this.StartListening = function()
    {
        if (listening || disposed)
            return;
        listening = true;
        hookEvent(attachElement, "mousedown", dragStart);
    };

    this.StopListening = function(stopCurrentDragging)
    {
        if (!listening || disposed)
            return;
        unhookEvent(attachElement, "mousedown", dragStart);
        listening = false;

        if (stopCurrentDragging && dragging)
            dragStop();
    };

    this.IsDragging = function() {
        return dragging;
    };
    this.IsListening = function() {
        return listening;
    };
    this.IsDisposed = function() {
        return disposed;
    };

    if (typeof (attachElement) === "string")
        attachElement = doc.getElementById(attachElement);
    if (attachElement === null)
        attachElement = element;

    if (!attachLater)
        this.StartListening();
}

function arrowsDown(e, arrows)
{
    var pos = getMousePos(e);

    if (getEventTarget(e) === arrows)
        pos.Y += parseInt(arrows.style.top);

    pos = correctOffset(pos, arrowsOffset, true);

    pos = pos.Bound(arrowsLowBounds, arrowsUpBounds);

    pos.Apply(arrows);

    arrowsMoved(pos);
}

function circleDown(e, circle)
{
    var pos = getMousePos(e);

    if (getEventTarget(e) === circle)
    {
        pos.X += parseInt(circle.style.left);
        pos.Y += parseInt(circle.style.top);
    }

    pos = correctOffset(pos, circleOffset, true);

    pos = pos.Bound(circleLowBounds, circleUpBounds);

    pos.Apply(circle);

    circleMoved(pos);
}

function arrowsMoved(pos, element)
{
    pos = correctOffset(pos, arrowsOffset, false);
    currentColor.SetHSV((256 - pos.Y) * 359.99 / 255, currentColor.Saturation(), currentColor.Value());
    colorChanged("arrows");
}

function circleMoved(pos, element)
{
    pos = correctOffset(pos, circleOffset, false);
    currentColor.SetHSV(currentColor.Hue(), 1 - pos.Y / 255.0, pos.X / 255.0);
    colorChanged("circle");
}

function colorChanged(source)
{
    doc.getElementById("hexBox").value = currentColor.HexString();
    doc.getElementById("redBox").value = currentColor.Red();
    doc.getElementById("greenBox").value = currentColor.Green();
    doc.getElementById("blueBox").value = currentColor.Blue();
    doc.getElementById("hueBox").value = Math.round(currentColor.Hue());
    var str = (currentColor.Saturation() * 100).toString();
    if (str.length > 4)
        str = str.substr(0, 4);
    doc.getElementById("saturationBox").value = str;
    str = (currentColor.Value() * 100).toString();
    if (str.length > 4)
        str = str.substr(0, 4);
    doc.getElementById("valueBox").value = str;

    if (source === "arrows" || source === "box")
        doc.getElementById("gradientBox").style.backgroundColor = Colors.ColorFromHSV(currentColor.Hue(), 1, 1).HexString();

    if (source === "box")
    {
        var el = doc.getElementById("arrows");
        el.style.top = (256 - currentColor.Hue() * 255 / 359.99 - arrowsOffset.Y) + 'px';
        var pos = new Position(currentColor.Value() * 255, (1 - currentColor.Saturation()) * 255);
        pos = correctOffset(pos, circleOffset, true);
        pos.Apply("circle");
        endMovement();
    }

    doc.getElementById("quickColor").style.backgroundColor = currentColor.HexString();
    input.value = currentColor.HexString();
    //input.style.background = currentColor.HexString();
}

function endMovement()
{
    doc.getElementById("staticColor").style.backgroundColor = currentColor.HexString();
}

function hexBoxChanged(e)
{
    currentColor.SetHexString(doc.getElementById("hexBox").value);
    colorChanged("box");
}

function redBoxChanged(e)
{
    currentColor.SetRGB(parseInt(doc.getElementById("redBox").value), currentColor.Green(), currentColor.Blue());
    colorChanged("box");
}

function greenBoxChanged(e)
{
    currentColor.SetRGB(currentColor.Red(), parseInt(doc.getElementById("greenBox").value), currentColor.Blue());
    colorChanged("box");
}

function blueBoxChanged(e)
{
    currentColor.SetRGB(currentColor.Red(), currentColor.Green(), parseInt(doc.getElementById("blueBox").value));
    colorChanged("box");
}

function hueBoxChanged(e)
{
    currentColor.SetHSV(parseFloat(doc.getElementById("hueBox").value), currentColor.Saturation(), currentColor.Value());
    colorChanged("box");
}

function saturationBoxChanged(e)
{
    currentColor.SetHSV(currentColor.Hue(), parseFloat(doc.getElementById("saturationBox").value) / 100.0, currentColor.Value());
    colorChanged("box");
}

function valueBoxChanged(e)
{
    currentColor.SetHSV(currentColor.Hue(), currentColor.Saturation(), parseFloat(doc.getElementById("valueBox").value) / 100.0);
    colorChanged("box");
}

function fixPNG(myImage)
{
    if (!doc.body.filters)
        return;
    var arVersion = navigator.appVersion.split("MSIE");
    var version = parseFloat(arVersion[1]);
    if (version < 5.5 || version >= 7)
        return;

    var imgID = (myImage.id) ? "id='" + myImage.id + "' " : "";
    var imgStyle = "display:inline-block;" + myImage.style.cssText;
    var strNewHTML = "<span " + imgID
            + " style=\"" + "width:" + myImage.width
            + "px; height:" + myImage.height
            + "px;" + imgStyle + ";"
            + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
            + "(src=\'" + myImage.src + "\', sizingMethod='scale');\"></span>";
    myImage.outerHTML = strNewHTML;
}

function fixGradientImg()
{
    fixPNG(doc.getElementById("gradientImg"));
}

function openColorPickerWindow(el) {
    input = el;
    if (input.value !== undefined && input.value !== "" && input.value !== null) {
        currentColor = Colors.ColorFromHex(input.value);
    } else {
        currentColor = Colors.ColorFromRGB(64, 128, 128);
    }
    var colWin = window.open("", "mywindow1", "status=1,width=545px,height=301px");
    doc = colWin.window.document;
    doc.write(getColorPickerHTML());
    doc.close();
    initColorPicker();
}

function initColorPicker() {
    fixGradientImg();
    new dragObject("arrows", "hueBarDiv", arrowsLowBounds, arrowsUpBounds, arrowsDown, arrowsMoved, endMovement);
    new dragObject("circle", "gradientBox", circleLowBounds, circleUpBounds, circleDown, circleMoved, endMovement);
    colorChanged('box');
    doc.getElementById("hexBox").addEventListener("change", hexBoxChanged());
    doc.getElementById("redBox").addEventListener("change", redBoxChanged());
    doc.getElementById("greenBox").addEventListener("change", greenBoxChanged());
    doc.getElementById("blueBox").addEventListener("change", blueBoxChanged());
    doc.getElementById("hueBox").addEventListener("change", hueBoxChanged());
    doc.getElementById("saturationBox").addEventListener("change", saturationBoxChanged());
    doc.getElementById("valueBox").addEventListener("change", valueBoxChanged());
}

function getColorPickerHTML()
{
    var html = '<style>#colorPickerMain{position:relative;height:286px;width:531px;border:1px solid black;}#gradientBox{cursor:crosshair;position:absolute;top:15px;left:15px;width:256px;height:256px;}#gradientImg{display:block;width:256px;height:256px;}#circle{position:absolute;height:11px;width:11px;}#hueBarDiv{position:absolute;left:310px;width:35px;height:256px;top:15px;}#hueBarImg{position:absolute;height:256px;width:19px;left:8px;}#arrows{position:absolute;height:9px;width:35px;left:0px;}#detailsDiv{position:absolute;left:370px;width:145px;height:256px;top:15px;}#detailsColDiv{position:absolute;border: 1px solid black;height:50px;width:145px;top:0px;left:0px;}#quickColor{position:absolute;height:50px;width:73px;top:0px;left:0px;}#staticColor{position:absolute;height:50px;width:72px;top:0px;left:73px;}#detailsTable{width: 100%;position:absolute;top:55px;}#detailsTable tbody tr{padding: 0;margin: 0;font-size: 75%;}#detailsTable tbody tr td{padding: 0;margin: 0;font-size: 80%;}#detailsTable tbody tr td input{padding: 0;margin: 0;}#hexBox, #redBox, #greenBox, #blueBox, #hueBox, #saturationBox, #valueBox{margin:0.3em;}</style><div id="colorPickerMain"><div id="gradientBox"><img id="gradientImg" src="data:image/png;base64,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"/><img id="circle" src="data:image/gif;base64,R0lGODlhCwALAJECAP///wAAAP///wAAACH5BAEAAAIALAAAAAALAAsAAAIflINoG+AeGFgGxEaXxVns2X2dh4CZJXBadDxQlihGAQA7"/></div><div id="hueBarDiv"><img id="hueBarImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAEACAIAAADeB9oaAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABwSURBVHja7NhBCoAwEATBIYr+/7uBoL5hhJxqmWvdmx1P0u1MrlRHkiRJkiRJ5i7lyijlTEiSJEmSJMnNsg1GkiRJkiRJ8oc8ViszSZIkSZIkyc2yzT6SJEmSJEmyl+0D7eu+SZIkSZIkSW6WrwADANtHl+ybwt35AAAAAElFTkSuQmCC"/><img id="arrows" style="" src="data:image/gif;base64,R0lGODlhIwAJAJECAG5tb////////wAAACH5BAEAAAIALAAAAAAjAAkAAAItFC6py90HTJjR2QtmOHrfv2Qa11WgJY7peDor9ZotE6/yTJfpjeeUgeh9IIICADs="/><br/></div><div id="detailsDiv"><div id="detailsColDiv"><div id="quickColor"></div><div id="staticColor"></div></div><br/><table id="detailsTable"><tbody><tr><td>Hex:</td><td><input size="8" type="text" id="hexBox"/></td></tr><tr><td>Red:</td><td><input size="8" type="text" id="redBox"/></td></tr><tr><td>Green:</td><td><input size="8" type="text" id="greenBox"/></td></tr><tr><td>Blue:</td><td><input size="8" type="text" id="blueBox"/></td></tr><tr><td>Hue:</td><td><input size="8" type="text" id="hueBox"/></td></tr><tr><td>Saturation:</td><td><input size="8" type="text" id="saturationBox"/></td></tr><tr><td>Value:</td><td><input size="8" type="text" id="valueBox"/></td></tr></tbody></table></div></div>';
    return html;
}

if (window.addEventListener) {
    window.addEventListener('click', function(e) {
        var el = e.target;
        if (el.getAttribute('data-color') === "color") {
            openColorPickerWindow(el);
        }
    });
} else if (window.attachEvent) {
    window.attachEvent('onclick', function(e) {
        var el = e.target;
        if (el.getAttribute('data-color') === "color") {
            openColorPickerWindow(el);
        }
    });
}
