const formatText = function(text)
{
  text=text.replace(/[.,?!+·"。，；？！—“”]/g,'');
  text=text.replace(/[\n、()（）]|又?称为?|或者?|即/g,';');
  text=text.replace(/ {2,}/g,' ');
  text=text.replace(/ *- */g,'');
  let group=text.split(';').filter(function(e){return e}); 
  group.forEach(function(text) {
   text = text.replace(/^ +| +$/g,'');
  });
  group=Array.from(new Set(group));
  const regex = RegExp('[^\x00-\xff]');
  group.sort(function(a,b)
  {
    let at=regex.test(a);
    let bt=regex.test(b);
    if(at!=bt)
      return bt-at;
    else{
    if (a < b )
      return -1;
    if (a > b ) 
      return 1;
    return 0;
    }
  });
  return group.join(';');
};

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
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onProcessNewExcerpt:','ProcessNewExcerpt');
      NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onProcessExcerptChange:','ChangeExcerptRange');
      //NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote');
      self.autodef = NSUserDefaults.standardUserDefaults().objectForKey('marginnote_autodef');
    },
    notebookWillClose: function(notebookid) {
      NSNotificationCenter.defaultCenter().removeObserverName(self,'ProcessNewExcerpt');
      NSNotificationCenter.defaultCenter().removeObserverName(self,'ChangeExcerptRange');
      //NSNotificationCenter.defaultCenter().removeObserverName(self, 'PopupMenuOnNote');
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
    onProcessNewExcerpt: function(sender){
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
    },
    /*onPopupMenuOnNote: function (sender) {
        if (!Application.sharedInstance().checkNotifySenderInWindow(sender, self.window)) return;//Don't process message from other window
        if (!self.autodef) return;
        let note = sender.userInfo.note;
        let titleText = note.noteTitle;
        let excerptText = note.excerptText.replace('**', '');
        let text = titleText || excerptText;
        if (text && text.length) {
            // Copy to Clipboard
            let pasteBoard = UIPasteboard.generalPasteboard();
            pasteBoard.string = text;
        }
    },*/
    toggleAutoDef: function(sender) {
      var lan = NSLocale.preferredLanguages().length?NSLocale.preferredLanguages()[0].substring(0,2):'en';
      if(self.autodef){
        self.autodef = false;
        if(lan == 'zh')
          Application.sharedInstance().showHUD('AutoDef已关闭',self.window,2);
        else
          Application.sharedInstance().showHUD('AutoDef off',self.window,2);
      }
      else{
        self.autodef = true;
        if(lan == 'zh')
          Application.sharedInstance().showHUD('AutoDef已打开',self.window,2);
        else
          Application.sharedInstance().showHUD('AutoDef On',self.window,2);
      }
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

