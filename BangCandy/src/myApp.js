var WelcomeLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        this.winSize = cc.Director.getInstance().getWinSize();
        var size = this.winSize;
        // add a "close" icon to exit the progress. it's an autorelease object
        var layer1 = cc.LayerColor.create(new cc.Color4B(0, 191, 255, 255), size.width, size.height);
        this.setTouchEnabled(true);
        this.addChild(layer1);
        //添加进入游戏的菜单
        this.addMenu();
        return true;
    },
    // a selector callback
    addMenu:function(){
        var label = cc.LabelTTF.create("single game", "Arial", 20);
        var menuItem = cc.MenuItemLabel.create(label, this.onBeginGameCallback, this);
        var label2 = cc.LabelTTF.create("Mul game", "Arial", 20);
        var menuItem2 = cc.MenuItemLabel.create(label2, this.onMulGameCallback, this);

        var menu = cc.Menu.create(menuItem,menuItem2);
        menu.setPosition(0,0);
        menuItem.setPosition(this.winSize.width/2 , this.winSize.height/2+100);
        menuItem2.setPosition(this.winSize.width/2 , this.winSize.height/2-100);
        this.addChild(menu, 1);
//        var labelMul = cc.LabelTTF.create("multy game", "Arial", 20);
//        var menuItemMul = cc.MenuItemLabel.create(labelMul, this.onMulGameCallback, this);
//
//        var menu = cc.Menu.create(menuItem);
////        menu.setPosition(0,0);
//        menuItemMul.setPosition(this.winSize.width/2 , this.winSize.height/2-20);

//        this.addChild(menu, 1);
    }  ,
    onMulGameCallback:function(){
        var director = cc.Director.getInstance();
        director.replaceScene(new MultGameScene());
    }   ,
    onBeginGameCallback:function(){
        var director = cc.Director.getInstance();
        director.replaceScene(new GameScene());
    }   ,
    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;
    },
    onTouchesMoved:function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                //this.circle.setPosition(touches[0].getLocation().x, touches[0].getLocation().y);
            }
        }
    },
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    }
});

var MyAppScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new WelcomeLayer();
        layer.init();
        this.addChild(layer);
    }
});