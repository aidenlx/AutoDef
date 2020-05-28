const defLimit=10;
const chs = RegExp(/[\u4e00-\u9fa5]/g);
const chsFisrt = function(a,b)
  {
    let at=chs.test(a);
    let bt=chs.test(b);
    if(at!=bt)
      return bt-at;
    else{
    if (a < b )
      return -1;
    if (a > b ) 
      return 1;
    return 0;
    }
  }
const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(/\b/g)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};
String.prototype.getWordCount=function()
{
  return ((this.match(/\b/g)||0).length||0)/2+((this.match(chs)||0).length||0)
}
const getGroupedDef = function(text,isTitle)
{
  if (text)
  { 
    text=text.toLowerCase();
    text=isTitle?text:text.split("\n").filter(e=>e.getWordCount()<defLimit).join("\n");//去除长句
    text=text.replace(/[.,?!+·"。，；？！—“”:：]/g,'');
    text=text.replace(/[、()（）]|又?称为?|或者?|即/g,'\n');
    text=text.replace(/ {2,}/g,' ');
    text=text.replace(/ *- */g,'');
    text=text.replace(/^ +| +$/gm,'');//去除开头与结尾的多余空格
    text.replace(/([A-Za-z]+)[( ]or ([A-Za-z]+) ([A-Za-z]+?(?=$))/gm,'$1 $3\n$2 $3;')
    return text.split(/[\n;]/g);//拆分行及原有的分词
  }
  else
    return null;
};
//输入含有GroupedDef的Array
const formatText = function(...groups)
{
  var group0=[];
  for (var g of groups) {
    group0=group0.concat(g);
  }
  group0=Array.from(new Set(group0));//es6新特性数组去重
  group0=group0.filter(e => e);//去除空值
  group0.sort(chsFisrt);
  return toTitleCase(group0.join(';'));
}


JSB.newAddon = function(mainPath){
  let newAddonClass = JSB.defineClass('AutoDef : JSExtension', /*Instance members*/{
    //Window initialize
    sceneWillConnect: function() {
        self.webController = WebViewController.new();
    },
    //Window disconnect
    sceneDidDisconnect: function() {
    },
    //Window resign active
    sceneWillResignActive: function() {
    },
    //Window become active
    sceneDidBecomeActive: function() {
    },
    notebookWillOpen: function(notebookid) {
      //NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onProcessNewExcerpt:','ProcessNewExcerpt');
      //NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onProcessExcerptChange:','ChangeExcerptRange');
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote');
      self.autodef = NSUserDefaults.standardUserDefaults().objectForKey('marginnote_autodef');
      self.switchtitle = NSUserDefaults.standardUserDefaults().objectForKey('marginnote.extension.switchtitle');
      self.autotitle = NSUserDefaults.standardUserDefaults().objectForKey('marginnote.extension.autotitle');
      self.autotitle_with_excerpt = NSUserDefaults.standardUserDefaults().objectForKey('marginnote.extension.autotitle_with_excerpt');

    },
    notebookWillClose: function(notebookid) {
      //NSNotificationCenter.defaultCenter().removeObserverName(self,'ProcessNewExcerpt');
      //NSNotificationCenter.defaultCenter().removeObserverName(self,'ChangeExcerptRange');
      NSNotificationCenter.defaultCenter().removeObserverName(self, 'PopupMenuOnNote');
    },
    documentDidOpen: function(docmd5) {
    },
    documentWillClose: function(docmd5) {
    },
    controllerWillLayoutSubviews: function(controller) {
    },
    queryAddonCommandStatus: function() {
      if(Application.sharedInstance().studyController(self.window).studyMode < 3)
        return {image:'title.png',object:self,selector:'toggleAutoDef:',checked:(self.autodef?true:false)};
      return null;
    },
    //Creating new note
    /*onProcessNewExcerpt: function(sender){
      if(!Application.sharedInstance().checkNotifySenderInWindow(sender,self.window))return;//Don't process message from other window
      if(!self.autodef)return;
      let noteid = sender.userInfo.noteid;
      let note = Database.sharedInstance().getNoteById(noteid);
      if(note && note.excerptText && note.excerptText.length > 0 && note.excerptText.length <= 250 && !note.groupNoteId){
        let timerCount = 0;
        NSTimer.scheduledTimerWithTimeInterval(1,true,function(timer){          
          let text = formatText(note.excerptText);//格式化处理新摘录的名词
          if(text && text.length){
            UndoManager.sharedInstance().undoGrouping('AutoDef',note.notebookId,function(){
              note.noteTitle = text;
              note.excerptText = '';
              Database.sharedInstance().setNotebookSyncDirty(note.notebookId);
            });
            NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('RefreshAfterDBChange',self,{topicid:note.notebookId});
          }
          timerCount++;
          if(timerCount >= 4){
            timer.invalidate();
          }
        });
      }
    },
    //在无标题时按照其内容添加名词标题
    onProcessExcerptChange: function(sender){
      if(!Application.sharedInstance().checkNotifySenderInWindow(sender,self.window))return;//Don't process message from other window
      if(!self.autodef)return;
      let noteid = sender.userInfo.noteid;
      let note = Database.sharedInstance().getNoteById(noteid);
      if(!note.noteTitle && note && note.excerptText && note.excerptText.length > 0 && note.excerptText.length <= 250 && !note.groupNoteId){
        let timerCount = 0;
        NSTimer.scheduledTimerWithTimeInterval(1,true,function(timer){          
          let text = note.allNoteText();
          text=formatText(text);//格式化处理新摘录的名词
          if(text && text.length){
            UndoManager.sharedInstance().undoGrouping('AutoDef',note.notebookId,function(){
              if (note.noteTitle!=text)
                note.noteTitle = text;
              Database.sharedInstance().setNotebookSyncDirty(note.notebookId);
            });
            NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('RefreshAfterDBChange',self,{topicid:note.notebookId});
          }
          timerCount++;
          if(timerCount >= 4){
            timer.invalidate();
          }
        });
      }
    },*/
    onPopupMenuOnNote: function (sender) {
        if (!Application.sharedInstance().checkNotifySenderInWindow(sender, self.window)) return;//Don't process message from other window
        if (!self.autodef) return;
        let note = sender.userInfo.note;
        if (note) {
          let timerCount = 0;
          NSTimer.scheduledTimerWithTimeInterval(1, true, function (timer) {
              let text = note.allNoteText();
              UndoManager.sharedInstance().undoGrouping('AutoDef', note.notebookId, function () {
                //自定义部分
                let title=getGroupedDef(note.noteTitle,true);//处理原标题
                let excerpt=getGroupedDef(note.noteTitle?text.substring(text.indexOf("\n") + 1):text,false);//处理下面的所有摘录
                note.noteTitle=formatText(title,excerpt);//输出
                //End
                Database.sharedInstance().setNotebookSyncDirty(note.notebookId);
              });
              NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('RefreshAfterDBChange', self, {topicid: note.notebookId});

              timerCount++;
              if (timerCount >= 1) {
                  timer.invalidate();
              }
          });
        }
    },
    toggleAutoDef: function(sender) {
      var lan = NSLocale.preferredLanguages().length?NSLocale.preferredLanguages()[0].substring(0,2):'en';
      let cnTips, enTips;
      if(self.autodef){
        self.autodef = false;
        cnTips='AutoDef已关闭';
        enTips='AutoDef disabled';
      }
      else{
        self.autodef = true;
        cnTips='点击笔记即可更新标题';
        enTips='Now you can click on notes to update titles';
        //目前无效
        /*
        if (self.autotitle || self.autotitle_with_excerpt || self.switchtitle) {
          self.autotitle = false;
          self.autotitle_with_excerpt = false;
          self.switchtitle = false;
          var list=self.autotitle?"autotitle,":''+
            self.autotitle_with_excerpt?"autotitle_with_excerpt,":''+
            self.switchtitle?"switchtitle,":'';
          cnTips = `开启同时已关闭冲突插件：${list}`;
          enTips = `The following conflict plugins are disabled: ${list}`;
        }
        */
      }
      Application.sharedInstance().showHUD(lan === 'zh' ? cnTips : enTips, self.window, 2);
      NSUserDefaults.standardUserDefaults().setObjectForKey(self.autodef,'marginnote_autodef');
      Application.sharedInstance().studyController(self.window).refreshAddonCommands();
    },
  }, /*Class members*/{
    addonDidConnect: function() {
    },
    addonWillDisconnect: function() {
    },
    applicationWillEnterForeground: function() {
    },
    applicationDidEnterBackground: function() {
    },
    applicationDidReceiveLocalNotification: function(notify) {
    },
  });
  return newAddonClass;
};

