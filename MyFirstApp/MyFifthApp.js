var MyFifthApp = cc.LayerColor.extend({
    sprite:null,
    spriteFrameNamePrefix:"Walk_left",
    spriteFrameIndex:0,
    init:function()
    {
        this._super(new cc.Color4B(0,0,0,255));
        // this.initWithColor(new cc.Color4B(0,0,0,255));
        var size = cc.Director.getInstance().getWinSize();

        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames("spritesheet.plist", "people.png");

        this.sprite = cc.Sprite.createWithSpriteFrameName(this.spriteFrameNamePrefix + "00.png");
        this.sprite.setPosition(new cc.Point(300,300));
        this.sprite.setScale(3);
        this.addChild(this.sprite);

        this.setKeyboardEnabled(true);
        return this;
    },
    onKeyUp:function(e){},
    onKeyDown:function(e){
        if(e == cc.KEY.left || e == cc.KEY.right){
            var prevPrefix = this.spriteFrameNamePrefix;
            if(e == cc.KEY.left)
                this.spriteFrameNamePrefix = "Walk_left";
            else
                this.spriteFrameNamePrefix = "Walk_right";
            if(prevPrefix !== this.spriteFrameNamePrefix)
                this.spriteFrameIndex = 0;


            if(this.spriteFrameIndex > 18)
                this.spriteFrameIndex = 0;
            var indexAsString;
            if(this.spriteFrameIndex < 10)
                indexAsString = "0" + this.spriteFrameIndex.toString();
            else
                indexAsString = this.spriteFrameIndex.toString();

            this.removeChild(this.sprite);
            this.sprite  = cc.Sprite.createWithSpriteFrameName(
                this.spriteFrameNamePrefix + indexAsString + ".png"
            );

            this.sprite.setPosition(new cc.Point(300,300));
            this.sprite.setScale(3);
            this.addChild(this.sprite);
            this.spriteFrameIndex++;
        }
    }
});


MyFifthAppScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new MyFifthApp();
        layer.init();
        this.addChild(layer);
    }
});
