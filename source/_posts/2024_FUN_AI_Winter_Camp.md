---
title: 2024 FUN AI Winter Camp 心得
---

## Day 1

**keynote: （speaker : [Jack Nikodem](https://www.linkedin.com/in/nikodem/?originalSubdomain=tw), Google）**

都在介紹何謂ＡＩ，ＡＩ對我們生活的影響是什麼，並且也有提到最近很熱門的ＬＬＭ

## Day 2

**keynote: （speaker : [郭彥伶](https://yenlingkuo.com/)，University of Virginia 助理教授）**

首先介紹了如何賦予機器人動作能力，使其能夠抓取特定物品，並識別影像中的特定對象。她還探討了候鳥的遷徙路徑和推薦系統的運作。緊接著，郭教授分享了她在2012至2016年期間作為google engineer的experience，詳細講解了「visually similar items」和「shop the look」(策展式搜索)的概念，以及google搜索引擎如何列出推薦商品和建立產品分類。

曾在google使用AI來產出相對應的藝術效果，比如：使用成功大學與成大環境特色相結合來讓ＡＩ產出一條相對應的圍巾，而產出的圍巾樣式個人覺得還不錯（還真有成大的感覺

資料與使用者互動的結果產生對現實生活中的創造，這邊講師提及：『雖說我們看ＡＩ所產出的產品也許看久了就會想說怎麼感覺都差不多，但是在仔細看看的話可以發現，ＡＩ產生的影像線條其實完全不一樣。』

- **Ｑ：如何與不同領域的人合作？**

 **Ａ：**基於我在MIT進行跨領域合作的經驗，我建議大家應該多與來自不同學科或專業的人建立聯繫。很多時候，與不同背景的人交流，可以激發合作的機會。尤其在當前AI技術熱門的情況下，我們不應僅局限於自己的領域，而應該積極尋求與其他領域專家的合作與討論。

- **Ｑ：如想申請美國學校就讀，side project或協助教授做事情，大三四應當要做什麼比較好？**

 **Ａ：**取決於你以後想要的路，如果你只是想要研究導向，那麼就是要設計演算法、創建AI model…，如果目標是業界，那麼就推薦２－３個月快速做些side project是比較推薦的。

More info:

[Shop the Look on Google](https://blog.google/products/ads/shop-look-on-google/)

[Google is launching Shop the Look to let you search and shop by outfit | TechCrunch](https://techcrunch.com/2016/09/06/google-is-launching-shop-the-look-to-let-you-search-and-shop-by-outfit/)

[Google搜尋引擎新增Shop the Look功能，讓你搜尋時裝立刻能網購](https://www.ithome.com.tw/news/108292)

**keynote: （speaker : 劉育綸，交大助理教授）**

因老師專業是影像處理，因此接下來就是影像處理的相關技術及名詞講解：frame（幀）、HDR Reconstruction，video stabilization…

影像處理會遇到的問題也一一的解釋，相機無法達到我們預想中的解析度問題來源是什麼？如何讓影像品質提高？分析前景背景該如何做？

這邊講師有提到用Image Inpainting來讓影像品質提高

**case:** 

拍攝影片後發現影像品質不穩定且沒聚焦

**problem:**

各種影像處理軟體的處理結果原因探究（ex:adobe pre）

**mention method:**

Image Inpainting : 影像品質提高

fusing multiple frames:使影片穩定

frame interpolation:frame快速更新（example: game screen sharing）

講師在meta intern時，團隊所提到的想法：enforcing cycle consistency

解說中都有提到，我不是要寫教學文，就不詳細寫了

- **Ｑ：如何收集影像資料？**

 **Ａ：**需要一大堆ground truth來得到訓練資料，並把ground truth逐一破壞來得到小區塊的ground truth，調整亮度曲線…，總而言之，就是透過複雜的方式調整參數，來得到我們最後的成品，手機所拍攝的照片還無法拿來當HDR的訓練資料，因為sensor過少，因此訓練資料都是高階單眼相機

- **Ｑ：test-time training的部分聽得沒有很清楚，能再講一遍嗎？**

**Ａ：**（講述如何訓練資料，我就不贅述了）

- **Ｑ：testing的data是什麼？**

**Ａ：**在testing中會調整參數，而用的data就是testing的sequence，從頭到尾不需要ground truth

還有其他問題，但我沒有聽得很清楚，這方面就抱歉了（汗

**keynote: （speaker : [邱維辰](https://walonchiu.github.io/)，交大）**

主題：從自駕車/機器視覺到美國進修

影像辨識：

visual recognition - various tasks（深度/距離預測）

結合深度估測→ 2D轉3D

synthetic data - cheap & controllable

challenge - domain gap

因訓練環境與真實環境有些根本上的差異，因此不一定能表現得好

question：如何把虛擬環境的表現轉移到真實環境？
main idea how to solve：

找到共同『橋樑』（我認為應該是指統一電腦與人的認知）

what is car?

『架構』像車子那我們統稱為車子，

domain adaptation for depth estimation

提及到generative AI，人們要警惕

機器學習三要素：1.數據2.模型3.任務

通常從數據和任務開始解決問題

舉了很多例子來解釋wide-range image blending

[Wei-Chen (Walon) Chiu's Website](https://walonchiu.github.io/)

## Day 3

## keynote: （speaker : Yu-Lin Chang & Emma Tu ，google Inc.）##

介紹生平、心靈雞湯、找回初心

## 活動project ##
魷魚遊戲：
主要就是計分遊戲，food有兩種：fish, garbage，不同food各自有不同的分數(ex: big fish, small fish, box garbage, plastic)，關卡1-15

More info: [2024 FUN AI WINTER CAMP 活動頁面](http://mislab.cs.nthu.edu.tw/explorecsr-3/index.html)


免責聲明：講師ＰＰＴ都有版權問題，就不放上來了。

