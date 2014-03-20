var BaseMulSpriteNode = cc.Node.extend({
        sprite:null,
    body:null,
    shape:null,
    space:null,
       ctor:function(){
           this._super();
           this.init();
       }   ,
       init :function(){
//           this._super();
           this.sprite = new cc.PhysicsSprite();
           this.sprite.fNode = this;
       }
})  ;
var  BaozhaSpriteNode = BaseMulSpriteNode.extend({
    ctor:function(pos,space){
        this._super();
        this.space = space;
        this.pos = pos;
        this.initBaozha(this.pos,this.space);
    }   ,
    initBaozha :function(pos,space){
//        this._super();
        this.space = space;
        var body = new cp.Body(1, cp.momentForCircle(1, 0, 24, cp.v(0, 0)));
        body.setPos(pos);

        this.body = body;
        this.space.addBody(body);
        var shape = new cp.CircleShape(body, 24, cp.v(0, 0));
        shape.setElasticity(1);
        shape.setFriction(0);
        shape.group = 2;
        shape.setCollisionType(3);
        this.space.addShape(shape);
        this.shape = shape;

//        var sprite = BangSprite.create(s_CloseNormal);
//        sprite.setTextureRect(cc.rect(0,0,48,48));
//        sprite.setColor(new cc.c3b(100,0,0));
        this.sprite.setBody(body);
    }             ,
    beginBangTimer :function(num){
        this.sprite.scheduleOnce(this.removeBang, num);
    } ,
    removeBang:function(){

        this.fNode.removeSelf();
    }  ,
    removeSelf: function() {
        this.space.removeBody(this.body);
        this.space.removeShape(this.shape);
        this.sprite.removeFromParent();
    }


}) ;
var  CandySpriteNode = BaseMulSpriteNode.extend({
    ctor:function(pos,vel,space){
        this._super();
        this.space = space;
        this.pos = pos;
        this.vel = vel
        this.initCandy(this.pos,vel,this.space);
    }   ,
    initCandy:function(pos,vel,space){
        this.space = space;
        var body = new cp.Body(1, cp.momentForCircle(1, 0, 24, cp.v(0, 0)));
        body.setPos(pos);
        body.setVel(vel);
        this.body = body;
        this.space.addBody(body);
        var shape = new cp.CircleShape(body, 24, cp.v(0, 0));
        shape.setElasticity(1);
        shape.setFriction(0);
        this.space.addShape(shape);
        this.shape = shape;
        shape.group = 1;
        shape.layers = 1;
        shape.setCollisionType(1);
        shape.sprite = this.sprite;
//        var sprite = BangSprite.create(s_CloseNormal);
//        sprite.setTextureRect(cc.rect(0,0,48,48));
//        sprite.setColor(new cc.c3b(100,0,0));
        this.sprite.setBody(body);
    }  ,
    initCandyWithNumber:function(num){
        this.sprite.init(s_CloseNormal);
        var labelNum = cc.LabelTTF.create(""+num, "Arial", 24);
        labelNum.setPosition(cp.v(20,20))  ;
        this.sprite.addChild(labelNum);
    }    ,
    removeSelf: function() {
        this.space.removeBody(this.body);
        this.space.removeShape(this.shape);
        this.sprite.removeFromParent();
    }
})  ;
var ZhadanSpriteNode = BaseMulSpriteNode.extend({
    timeLable:null,
    ctor:function(pos,vel,space){
        this._super();
        this.space = space;
        this.pos = pos;
        this.vel = vel
        this.initZhadan(this.pos,vel,this.space);
    }   ,
    initZhadan:function(pos,vel,space) {
        this.space = space;
        var body = new cp.Body(1, cp.momentForCircle(1, 0, 24, cp.v(0, 0)));
        body.setPos(pos);
        body.setVel(vel);
        this.body = body;
        this.space.addBody(body);
        var shape = new cp.CircleShape(body, 24, cp.v(0, 0));
        shape.setElasticity(1);
        shape.setFriction(0);
        shape.setLayers(2);

        this.space.addShape(shape);
        this.shape = shape;

//        var sprite = BangSprite.create(s_CloseNormal);
//        sprite.setTextureRect(cc.rect(0,0,48,48));
//        sprite.setColor(new cc.c3b(100,0,0));
        this.sprite.setBody(body);

    }     ,
    scheTime:function(timeNum){
            this.timerDownNum= timeNum;
            this.timeLable = cc.LabelTTF.create(timeNum, "Arial", 24);
        this.timeLable.setPosition(cp.v(24,24));
        this.sprite.addChild(this.timeLable);
        this.sprite.schedule(this.timerDown,1);
        this.sprite.scheduleOnce(this.zhadanBang,timeNum);
    }  ,
    timerDown:function(){
        var theNode = this.fNode;
        theNode.timerDownNum = theNode.timerDownNum-1;
        theNode.timeLable.setString(theNode.timerDownNum);
        if(theNode.timerDownNum<=0){
            this.unschedule(theNode.timerDown);
        }
    }   ,
    zhadanBang:function(){
        var theNode = this.fNode;
        theNode.makeABangzhaAt(this.fNode.body.getPos());
        var audioEngine = cc.AudioEngine.getInstance();
        audioEngine.playEffect(s_m_bang);
        theNode.removeSelf();
    },
    makeABangzhaAt:function(pos){
        var emtter = cc.ParticleSun.create();
        emtter.setAutoRemoveOnFinish(true);
        emtter.setDuration(1);
        emtter.setStartSize(24);
        emtter.getEndSize(-1);
        emtter.setPosition(pos);
        this.sprite.getParent().addChild(emtter);
        var myTexture = cc.TextureCache.getInstance().addImage(s_fire);
        emtter.setTexture(myTexture);

        var bangSpriteNode = new BaozhaSpriteNode(pos,this.space);

       bangSpriteNode.sprite.initWithFile(s_CloseNormal);
        bangSpriteNode.sprite.setOpacity(0);

//        bangSpriteNode.initBaozha(pos,this.space);
        this.sprite.getParent().addChild(bangSpriteNode.sprite);
        bangSpriteNode.beginBangTimer(1);
//        bangSpriteNode.beginBangTimer(1);
    }   ,
    removeSelf: function() {
        this.space.removeBody(this.body);
        this.space.removeShape(this.shape);
        this.sprite.removeFromParent();
    }
})  ;
var MulGameLayer =  cc.Layer.extend({
    winsize:null,
    space:null,
      init:function(){
          this._super();

          this.initLayout();
           this.initPhysics();
          this.scheduleUpdate();
          this.showSomeInfo('begin game');
//          var baozha = new BaozhaSpriteNode(cp.v(100,100),this.space);
          this.beginGameWithNum(2);
      }   ,
    initLayout:function(){
        this.winsize = cc.Director.getInstance().getWinSize();
        var layer1 = cc.LayerColor.create(new cc.Color4B(34, 139, 34, 255), this.winsize.width, this.winsize.height);
        this.addChild(layer1);
        var kongzhiHeight = 50;
        this.kongzhiHeight = kongzhiHeight;
        var layerKongzhi = cc.LayerColor.create(new cc.c4b(237,87,54,255),this.winsize.width,kongzhiHeight);
        this.addChild(layerKongzhi);
        this.setTouchEnabled(true);
    }   ,
    initPhysics:function(){
        this.space = new cp.Space();
        var space = this.space;
        var staticBody = space.staticBody;
        var winSize = this.winsize;
//        var winSize = this.youxiSize;
        // Walls

        var walls = [ new cp.SegmentShape(staticBody, cp.v(0, this.kongzhiHeight), cp.v(winSize.width, this.kongzhiHeight), 0),				// bottom
            new cp.SegmentShape(staticBody, cp.v(0, winSize.height), cp.v(winSize.width, winSize.height), 0),	// top
            new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(0, winSize.height), 0),				// left
            new cp.SegmentShape(staticBody, cp.v(winSize.width, 0), cp.v(winSize.width, winSize.height), 0)	// right
        ];
        for (var i = 0; i < walls.length; i++) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(0);
            space.addStaticShape(shape);
        }
        this.space.addCollisionHandler(1, 3, null, this.bangzheCandy, null, null);
    }   ,
    update:function(delt){
        this.space.step(delt);
    }   ,
    showSomeInfo:function(info){
        var duringtime = 3;
        var labelInfo = cc.LabelTTF.create(info, "Arial", 24);
        labelInfo.setPosition(cp.v(this.winsize.width/2,this.winsize.height/2));
         this.addChild(labelInfo);
        var fadeaction = cc.FadeTo.create(duringtime,0);
        labelInfo.runAction(fadeaction);
        this.scheduleOnce(function(){
            labelInfo.removeFromParent();
        },duringtime) ;
    }   ,
     beginGameWithNum:function(num){
        for(var i=0;i<num;i++){

            var candy = this.makeARandomCandy();
            candy.initCandyWithNumber(i);
            this.addChild(candy.sprite);
        }
     }  ,
    makeARandomCandy:function(){

        var posX = Math.random()*this.winsize.width;
        var posY = Math.random()*(this.winsize.height-this.kongzhiHeight)+this.kongzhiHeight;
        var velX = Math.random()*150+20;
        var velY = Math.random()*150+20;
       return new CandySpriteNode(cp.v(posX,posY), cp.v(velX,velY), this.space);
    }   ,
    onTouchesBegan: function (touches, event) {
        this.isMouseDown = true;
        var touchPos = touches[0].getLocation();
        if(touchPos.y<this.kongzhiHeight){
            return;
        }


//        cc.log("touch at position"+touches[0].getLocation().x+touches[0].getLocation().y) ;
//        this.addSpriteAtPositionAndVel(touches[0].getLocation(),cp.v(0,0)) ;
        this.addNextBangAtPosition(touches[0].getLocation());

    },
    addNextBangAtPosition: function (pos) {
//          var body = this.makeZhadanBody(pos);

        var spriteNode = new ZhadanSpriteNode(pos,cp.v(0,0),this.space);
       spriteNode.sprite.initWithFile(s_Zhadan,cc.rect(0,0,48,48));
//        spriteNode.initZhadan(pos,cp.v(0,0),this.space);
        this.addChild(spriteNode.sprite);
        spriteNode.scheTime(3);

    },
    onTouchesEnded: function (touches, event) {
        this.isMouseDown = false;
    }     ,
    bangzheCandy: function (arbs,space) {
        cc.log("bingo");
        var shapes = arbs.getShapes();
        var candy = shapes[0];
        var candySprite = candy.sprite ;

        candySprite.scheduleOnce(function(){
            var parentsLayer =  candySprite.getParent() ;
//            parentsLayer.addACandySprite();
//            parentsLayer.addARandomZhadan();
//            parentsLayer.labelTimer.setString(parentsLayer.zhadans[0]);
//            parentsLayer.score = parentsLayer.score+1;
//            parentsLayer.labelscore.setString("score:"+parentsLayer.score);
            candySprite.fNode.removeSelf();

//            that.addACandySprite();

        },0);


        return 0;
    }
})  ;
var MultGameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MulGameLayer();
        layer.init();
        this.addChild(layer);
    }
});