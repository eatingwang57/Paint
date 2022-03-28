const canvas = document.querySelector('#Canvas');
const ctx = canvas.getContext("2d");

var Enable = false;
var isPen = false, isEraser = false,  isLight = false;
var isLine = false, isText = false, isShape = false;
var isRainbow = false, isFilled = false;
var shape, fontstyle, fontsize;
var hue = 0;
var step = -1, step_arr = [];
var propety = [];
var x0, x1, y0, y1;


~function init(){
    ctx.strokeStyle = "#95e0f7";
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.font = "8px Arial";
    propety = [ctx.strokeStyle, ctx.lineWidth, ctx.lineJoin, ctx.lineCap];
    store();
}();

~function getoffset(){
    offsetX = canvas.getBoundingClientRect().left;
    offsetY = canvas.getBoundingClientRect().top;
    console.log(offsetX, offsetY, canvas.offsetLeft, canvas.offsetTop);
}();

function store(){
    step++;
    if(step < step_arr.length){
        step_arr.length = step;
    }
    step_arr.push(canvas.toDataURL());
    console.log(step);
}

canvas.addEventListener('mousedown', down);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', up);
canvas.addEventListener('mouseout', out);


//滑鼠事件
function down(e){
    console.log(e);
    if(isPen || isEraser || isLine || isLight || isShape || isText) Enable = true;
    console.log(e.clientX, e.offsetX, e.clientY, e.offsetY);
    x0 = e.offsetX;
    y0 = e.offsetY;
    x1 = e.offsetX;
    y1 = e.offsetY;
    
    if(isText) trytext();
    else Textbox.style.visibility = "hidden";

    //筆畫的設定
    ctx.globalAlpha = 1;
    if(isEraser) ctx.globalCompositeOperation="destination-out";
    else if(isPen || isLine || isText || isShape) ctx.globalCompositeOperation="source-over";
    else if(isLight){
        ctx.globalCompositeOperation = "multiply";
        ctx.globalAlpha = 0.2;
    }

    //點下就會畫（一點）
    /*if(isPen || isEraser || isLight){
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }*/
}

function up(e){
    Enable = false;
    if(isPen || isEraser || isLine || isLight || isShape || isText) store();
}

function out(e){
    if(Enable) store();
    Enable = false;
    //x0 = e.offsetX;
    //y0 = e.offsetY;
}

//筆畫 (Mousemoving)
function draw(e){
    if(!Enable) return;
    console.log(e);

    if(isRainbow){
        ctx.strokeStyle = "hsl(" + hue + ", 100%, 50%)";
        hue++;
    }
    console.log(isEraser);
    if(isShape){
        var canvasPic = new Image(); 
        canvasPic.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasPic, 0, 0);

            if(isRainbow) ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
            else ctx.fillStyle = propety[0];
            //console.log(x0, y0, x1, y1);
            switch(shape){
                case('circle'):
                    var r = (Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)))/2;  //radius
                    ctx.beginPath();
                    ctx.arc((x1+x0)/2, (y1+y0)/2, r, 0, 2*Math.PI);
                    if(!isFilled) ctx.stroke();
                    else ctx.fill();
                    break;
                case('triangle'):
                    ctx.beginPath();
                    ctx.moveTo((x1+x0)/2, y1);
                    ctx.lineTo(x0, y0);
                    ctx.lineTo(x1, y0);
                    ctx.closePath();
                    if(!isFilled) ctx.stroke();
                    else ctx.fill();    
                    break;
                case('rectangle'):
                    if(!isFilled) ctx.strokeRect(x1, y1, x0-x1, y0-y1); 
                    else ctx.fillRect(x1, y1, x0-x1, y0-y1);  
                    break;
                case('square'):
                    if(!isFilled) ctx.strokeRect(x1, y1, x0-x1, x0-x1); 
                    else ctx.fillRect(x1, y1, x0-x1, x0-x1);
                    break;
            }        
        };
        canvasPic.src = step_arr[step];
    }
    else if(isLine){
        var canvasPic = new Image();
        canvasPic.src = step_arr[step];
        canvasPic.onload = function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasPic, 0, 0);
            ctx.beginPath();
            console.log(x0, y0, x1, y1);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x0, y0);
            ctx.stroke();
        };
    }
    else if(isPen || isEraser || isLight){
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        console.log(x0, e.pageX, y0, e.offsetY);
    }
    x0 = e.offsetX;
    y0 = e.offsetY;
}

//筆
var Pen = document.getElementById('pen');
Pen.addEventListener('click', function(){
    if(!isPen) isPen = true;
    [isEraser, isLine, isLight, isShape, isText] = [false,  false, false, false, false];
    canvas.style.cursor = "url('images/pen.png') 0 16, auto";
});

//橡皮擦
var Erase = document.getElementById('eraser');
Erase.addEventListener('click', function(){
    if(!isEraser) isEraser = true;
    [isPen, isLine, isLight, isShape, isText] = [false,  false, false, false, false];
    canvas.style.cursor = "url('images/eraser.png') 0 16, auto";
});

//筆刷顏色
var chooseColor = document.getElementById('color');
chooseColor.addEventListener('input', function(){
    ctx.strokeStyle = document.querySelector('#color').value;
    propety[0] = ctx.strokeStyle;
}, false);


//筆刷大小
var changeSize = document.getElementById('size');
changeSize.addEventListener('change', function(){
    ctx.lineWidth = document.getElementById('size').value;
    propety[1] = ctx.lineWidth;
});

//彩虹模式
var rainbow = document.getElementById('rainbow');
rainbow.addEventListener('click', function(){
    if(isRainbow){
        isRainbow = false;
        ctx.strokeStyle = propety[0];
        hue = 0;
    }else{
        isRainbow = true;
    }
});

//螢光筆
var highlight = document.getElementById('highlighter');
highlight.addEventListener('click', function(){
    if(!isLight) isLight = true;
    [isPen, isEraser, isLine, isShape, isText] = [false,  false, false, false, false];
    canvas.style.cursor = "url('images/draw.png') 0 16, auto";
});

//畫直線
var drawLine = document.getElementById('line');
drawLine.addEventListener('click', function(){
    if(!isLine) isLine = true;
    console.log(isLine);
    [isPen, isEraser, isLight, isShape, isText] = [false, false,  false, false, false];
    canvas.style.cursor = "url('images/crosshair.png') 8 8, crosshair";
});


//畫圖形
function shapes(s){
    shape = s;
    if(!isShape) isShape = true;
    [isPen, isEraser, , isLine, isLight, isText] = [false,  false, false, false, false];
    canvas.style.cursor = "url('images/crosshair.png') 8 8, crosshair";
}

//填滿
var fill = document.getElementById('fill');
fill.addEventListener('click', function(){
    isFilled = !isFilled;
});


//打字
var T = document.getElementById('text');
T.addEventListener('click', function(){
    if(!isText) isText = true;
    [isPen, isEraser, isLine, isLight, isShape] = [false,  false, false, false, false];
    console.log(isPen, isEraser, isLine, isLight, isShape);
    canvas.style.cursor = "url('images/letter.png'), auto";
});

//換字體和大小
var style = document.getElementById('selectstyle');
style.addEventListener('change', function(){
    fontstyle = style.value;
});

var size = document.getElementById('selectsize');
size.addEventListener('change', function(){
    fontsize = size.value;
});

//放文字方塊
var x, y, flag = 0;
var xx, yy;
var Textbox = document.getElementById('textbox');
function trytext(){
    xx = offsetX + x0;
    yy = offsetY + y0;
    console.log(xx, yy);
    Textbox.style.left = xx + "px";
    Textbox.style.top = yy + "px";
    if(!flag){
        [x, y] = [x0, y0];
        flag = 1;
    }
    Textbox.style.visibility = "visible";
}

Textbox.addEventListener('change', function(){
    ctx.font = fontsize + "px " + fontstyle;
    ctx.fillStyle = propety[0];
    ctx.fillText(Textbox.value, x, y+10);
    flag = 0;
    Textbox.style.visibility = "hidden";
    Textbox.value = "";
    store();
});


//下載成png檔
var download = document.getElementById('save');
download.addEventListener('click', function(){
    this.href = document.getElementById('Canvas').toDataURL();
    this.download = "Mycanvas.png";
}, false);

//上傳圖片
var upload = document.getElementById('image');
upload.addEventListener('change', function(){
    Textbox.style.visibility = "hidden";
    var img = new Image();
    img.onload = function(){
        [canvas.width, canvas.height] = [this.width, this.height];
        ctx.drawImage(this, 0, 0);
        console.log(canvas.width, canvas.height);
        console.log(this.width, this.height);
        [ctx.strokeStyle, ctx.lineWidth, ctx.lineJoin, ctx.lineCap] = propety;
        ctx.font = fontsize + "px " + fontstyle;
        store();
    }
    img.src = URL.createObjectURL(this.files[0]);
    this.value = "";
});


//目前canvas在左上角，0, 0 為他最左上的位置，
//若之後要在中間（或哪裡）可再設定！！ 

//undo
var Undo = document.getElementById('undo');
Undo.addEventListener('click', function(){
    var canvasPic = new Image();

    ctx.globalCompositeOperation="source-over";
    ctx.globalAlpha = 1;

    if(step > 0){
        step--;
        canvasPic.src = step_arr[step];
        canvasPic.onload = function(){
            if(this.width != canvas.width || this.height != canvas.height){
                [canvas.width, canvas.height] = [this.width, this.height];
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasPic, 0, 0);
            [ctx.strokeStyle, ctx.lineWidth, ctx.lineJoin, ctx.lineCap] = propety;
            ctx.font = fontsize + "px " + fontstyle;
        }
    }
    else{
        canvasPic.onload = function(){
            if(this.width != canvas.width || this.height != canvas.height){
                [canvas.width, canvas.height] = [this.width, this.height];
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasPic.src, 0, 0);
            [ctx.strokeStyle, ctx.lineWidth, ctx.lineJoin, ctx.lineCap] = propety;
            ctx.font = fontsize + "px " + fontstyle;
        }
    } 
});

//redo
var Redo = document.getElementById('redo');
Redo.addEventListener('click', function(){
    ctx.globalCompositeOperation="source-over";
    ctx.globalAlpha = 1;

    if (step >= 0 && (step < step_arr.length - 1)) {
        step++;
        var canvasPic = new Image();
        
        canvasPic.src = step_arr[step];
        canvasPic.onload = function () {
            if(this.width != canvas.width || this.height != canvas.height){
                [canvas.width, canvas.height] = [this.width, this.height];
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasPic, 0, 0);
            [ctx.strokeStyle, ctx.lineWidth, ctx.lineJoin, ctx.lineCap] = propety;
            ctx.font = fontsize + "px " + fontstyle;
        }
    }
});

//清除全部
var clearButton = document.getElementById('clear');
clearButton.addEventListener('click', function(){
    if(step > 0){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Textbox.style.visibility = "hidden";
        store();
    }  
});