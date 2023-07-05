// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
 //设定刷新间隔
const w = new ListWidget()
      w.refreshAfterDate = new Date((Date.now()+10800000))
      log('下次刷新时间：'+w.refreshAfterDate)
//面板最底下小字颜色
let lightColor = new Color('#ffffff',0.7)
let darkColor = new Color('#888888')
      
 //转换时间格式
let dateTime = new Date()

  let all = new DateFormatter()
  let ymd = new DateFormatter()
  let y = new DateFormatter()
  let m = new DateFormatter()

     all.dateFormat = 'EE yyyy/MM/dd HH:mm'
     ymd.dateFormat = 'yyyyMMdd'
     y.dateFormat = 'y'
     m.dateFormat = 'MM'

      let Nall = all.string(dateTime)
      let Nymd = ymd.string(dateTime)
      let Ny = y.string(dateTime)
      let Nm = m.string(dateTime)

 //判断是否获取农历，并存储[kymd][knl][ksc]的值
 //判断依据：[kymd]的值 == 当前日期  

if (Keychain.get('kymd') != Nymd){
log('当天第一次获取农历...')

const headers ={

'Host':'m.nongli.cn',
'Accept-Encoding':'gzip, deflate, br',
'Cookie':'',
'Connection':'keep-alive',
'Accept':'text/plain, **',
'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1',
'Referer':'https://m.nongli.cn/rili/',
'Accept-Language':'zh-cn',
'X-Requested-With':'XMLHttpRequest'
}

const url = 'https://m.nongli.cn/rili/api/app/god/'+Ny+'/'+Nm+'/'+Nymd+'.js'
      log('农历请求链接：'+url)

const reqnl = new Request(url)
       reqnl.headers = {
        ...headers,}
const resnl = await reqnl.loadJSON()

// log(resp)

var nl = resnl.html.nongli.match(/.{4}(?=\s)/)[0]
log('农历日期：'+nl)
var sc = resnl.html.suici
log('天干地支：'+sc)
Keychain.set('kymd',Nymd)
Keychain.set('knl',nl)
Keychain.set('ksc',sc)
}

 //读取wifi状态  0：关｜1：开
let file = FileManager.iCloud()
let dir = fm.documentsDirectory()

/*删掉本行注释 及 下方对应注释，并配置wifi状态文件，即可根据wifi状态决定是否查询

let Npath = file.joinPath(dir, "NetworkStatus.txt")

删掉本行注释 及 上方对应注释，并删除下一行的  0 //     */

let raw = 0 //file.readString(path)

//根据wifi状态决定是否查询套餐。1：不查询；否则，0：查询。
if (raw == 0){
   console.log('判断wifi状态：已断开-->'+raw)
  
let noti = new Notification()
noti.title ='开始获取套餐内容，生成Widget....'
noti.schedule()
 
let Upath = file.joinPath(dir, "UnicomCookie.txt")
let cokie = file.readString(Upath)
//log(cokie)
const headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@10.0400}',
    'Host':'m.client.10010.com',
    'Accept':'application/json, text/plain, */*',
    //'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': cokie,
};

const url = "https://m.client.10010.com/servicequerybusiness/operationservice/queryOcsPackageFlowLeftContentRevisedInJune"

 const request = new Request(url)
       //request.method = 'POST'
       request.headers = {...headers,}
       console.log('获取套餐明细...')
 const resp = await request.loadJSON()
       console.log('获取成功')

/////////////////主体内容开始////////////////////

//以下从返回的词典中取值：短信、通话、定向、通用、合计

const dx = resp.unshared[2].details[0].remain
const th = resp.unshared[1].details[0].remain
const cs = resp.unshared[0].details[0].use
const tym = resp.unshared[0].details[1].use
const tyg = (tym/1024).toFixed(2)
const hj = (resp.summary.sum/1024).toFixed(2)

w.addSpacer(3)

//主体内容
//左侧内容
 //leftmain.centerAlignContent()
  //s0.addSpacer(19)
const main = w.addStack()

 const leftmain =main.addStack()
             leftmain.layoutVertically()
 
  const lc = leftmain.addText('剩余短信    剩余通话')
    lc.textColor = Color.white()
    lc.font = Font.boldSystemFont(15)
  
  leftmain.addSpacer(4)
  const lc2 = leftmain.addText('  '+dx+'    '+th)
    lc2.textColor = Color.white()
    lc2.font = Font.lightSystemFont(25)
  
  leftmain.addSpacer(4)
  const lc3 = leftmain.addText('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
  lc3.textColor = Color.white()
  lc3.font = Font.lightSystemFont(5)

sums={
"定向":resp.unshared[0].details[0].use+" MB",
"通用":tym+" MB",
"合计":tyg+'/'+hj+'GB'
     }

for(let sum in sums){
      const lfa = leftmain.addText(sum+'：'+sums[sum])
         lfa.textColor = Color.white()
         lfa.font = Font.mediumSystemFont(13) 

       const lfb = leftmain.addText('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
          lfb.textColor = Color.white()
          lfb.font = Font.lightSystemFont(5)
}

main.addSpacer(45)

//右侧内容
 const rightmain =main.addStack()
           rightmain.layoutVertically()

  const rc = rightmain.addText("风光灿灿")
      rc.textColor = Color.white()
      rc.font = Font.boldSystemFont(18)
 
rightmain.addSpacer(4)  
   const rc1 = rightmain.addText("              不识旧人")
      rc1.textColor = Color.white()
      rc1.font = Font.boldSystemFont(18)
 
  rightmain.addSpacer(23)
 /*
  const rc2 = rightmain.addText('  '+dy+'    '+th)
    rc2.textColor = Color.white()
    rc2.font = Font.lightSystemFont(25)
  
  rightmain.addSpacer(4)
  const rc3 = rightmain.addText('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    rc3.textColor = Color.white()
    rc3.font = Font.lightSystemFont(5)*/

sus=['人言是非曲中直','人行坦荡繁就简']

for(let su in sus){
  
  const rha = rightmain.addText(sus[su])
    rha.textColor = Color.white()
    rha.font = Font.mediumSystemFont(19) 
  
  const rhb = rightmain.addText('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -')
    rhb.textColor = Color.white()
    rhb.font = Font.lightSystemFont(5)
}
  
   const f1 = w.addText(Nall+'   '+Keychain.get('knl')+'  '+Keychain.get('ksc'))
        f1.textColor = Color.dynamic(lightColor,darkColor)
        f1.font = Font.boldSystemFont(12)
}

else{
let noti = new Notification()
noti.title ='Hello,World! 刷新'
noti.schedule()

w.addSpacer(30)
         
   const ma = w.addText('Hello,World!')
       ma.textColor = new Color("#ffffff",0.9);
       ma.font = Font.boldSystemFont(36);
       ma.centerAlignText();
      
w.addSpacer(20)
    const f1 = w.addText(Nall)
       f1.centerAlignText();
w.addSpacer(2)
    const f2 = w.addText(Keychain.get('knl')+'  '+Keychain.get('ksc'))
       f2.centerAlignText();
       
      f1.textColor = Color.dynamic(lightColor,darkColor)
      f1.font = Font.boldSystemFont(13.5)
      f2.textColor = Color.dynamic(lightColor,darkColor)
      f2.font = Font.boldSystemFont(13.5)

}
///////////////////主体内容结束////////////////////

//自适应明、暗主题的渐变色背景
//const gradient = new LinearGradient();
//gradient.locations = [0, 1];
// 渐变的颜色。locations颜色数组应包含与渐变属性相同数量的元素。

//夜间
let darkColor1 = new Color("#646c69")//#18232b
//let darkColor2 = new Color("#646c69")//#3c414e

//白天
let lightColor1 = new Color("#bfccc6")//#348abe
/*
let lightColor2 = new Color("#bfccc6")//#64a9c9
  
let q = Color.dynamic(lightColor1,darkColor1)
let h =Color.dynamic(lightColor2,darkColor2)
    gradient.colors = [q,h]
    w.backgroundGradient = gradient;*/
    
 w.backgroundColor=Color.dynamic(lightColor1,darkColor1)

//输出
Script.setWidget(w)
Script.complete()
w.presentMedium()
