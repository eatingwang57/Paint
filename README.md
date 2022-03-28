# Software Studio 2020 Spring
## Assignment 01 Web Canvas


# README

### How to use 
一點進網址會看到這樣的外觀：

![](https://i.imgur.com/tNIDOs7.png)

    左、右及上方都有按鈕，大致分為不同方面的功能。
    將滑鼠移到相對應的按鈕上點擊，即可以在畫布上使用該功能。


:::info
左側功能欄為基本繪畫功能
（這些功能在畫布上的游標會隨著不同功能而改變，可用來區分功能。）
:::
由上至下依序為：
*  Pen：可隨著滑鼠的位置畫出線條 
*  Marker：同上，但是是比較淡的螢光筆線條 
*  Eraser：可擦除畫布上的東西
*  Text：可放置文字方塊並輸入文字，按enter或是畫布其他地方，文字就會呈現出來
*  Line ：可以畫出從滑鼠點下位置到放開位置的直線
*  Shape -- Circle, Triangle, Rectangle and Square：可畫出各種大小的不同圖形



:::info
右側功能欄為一些調整功能
:::
由上至下依序為：
* 彩虹模式：點一下可以把顏色換成彩虹，再點一下解除模式
* 選擇顏色：點了會跳出網頁內建的顏色選擇器，可以選顏色
* 形狀填滿：點一下可以畫出填滿的圖形，再點一下則回到空心
* 筆畫粗細：可以拖拉的方式改變筆畫的粗細，由上到下會越來越粗
* 文字大小：有多種文字大小可以選擇，按下會跳出選項
* 字體：有多種文字字體可以選擇（包含中文和英文），按下會跳出選項

:::info
上方左側為清除和回復功能
:::
由左至右依序為：
*  Clear：按下可以清除畫布上所有的東西
*  Undo：按下可以清除上一步
*  Redo：按下可以重做上一布

:::info
上方右側為上傳、下載功能
:::
由左至右依序為：
* Upload：按下可以從電腦中選取照片檔案上傳到畫布上
* Download：按下可以下載目前畫布，存成png檔

### Function description

我所做的bonus有：

1. Marker
    按下按鈕後，設畫筆的透明度為0.2，改變透明度讓它有螢光筆的感覺：並且改變合成效果，模擬螢光筆筆畫相疊處，顏色加深。                   
    ```
        ctx.globalAlpha = 0.2;
        ctx.globalCompositeOperation = "multiply";
    ```     
    ![](https://i.imgur.com/EA7Lntv.png)

2. Line
    能夠畫出從起始點到終點的直線，再也沒有自己畫線畫不直的問題！
    和畫圖形的方式很像，每次滑鼠移動時。都會先清掉之前的筆畫，再重新畫到畫布上。
    ```
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
    ```  
    ![](https://i.imgur.com/KUp79mW.png)

3. 彩虹模式
    按下按鈕可以把畫筆變成隨著移動而變色的彩虹筆。彩虹模式可以套用在所有的基本繪圖功能上，但是他不能讓一個圖形或線條在被畫好時，同時擁有不同的顏色，他只能在畫的過程、滑鼠移動的過程中有不同的顏色。
    設定一個global變數代表顏色，當進到彩虹模式時，每次滑鼠移動時便將他加一，產生不同的顏色。
    ```
        var hue = 0;
        ...
        if(isRainbow){
        ctx.strokeStyle = "hsl(" + hue + ", 100%, 50%)";
        hue++;
        }
    ```   
    ![](https://i.imgur.com/MkzR9J5.png)
