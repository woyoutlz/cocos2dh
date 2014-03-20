var BangSpriteNode = cc.Node.extend({
      sprite:null,
    body:null,
    space:null,
    shape:null,
    ctor:function () {
        this._super();

//        this.spriteSheet = spriteSheet;
//        this.space = space;
        this.init();
    },
    init: function () {
        this._super();
        this.sprite = new cc.PhysicsSprite();
        this.sprite.fNode = this;
//        this.sprite.scheduleOnce(function(){cc.log("aaaa")},2);
//        cc.log("bbb");
    },
    initBaozha:function(pos,space){
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

    }   ,
    initTheZhadan: function (pos, vel, space) {
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

    },
    initCandyWithSpace: function (pos, vel, space) {
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
    },
    zhadanTimer:function(second){
        //timer lable
        this.sprite.timerDownNum = second;

        var labelTimer = cc.LabelTTF.create(second, "Arial", 24);
        labelTimer.setPosition(cp.v(24,24));
        this.sprite.labelTimer = labelTimer;
        this.sprite.addChild(labelTimer);
        this.sprite.schedule(this.timerDown,1);
        this.sprite.scheduleOnce(this.zhadanBang,second);
    }   ,
    timerDown:function(){
        this.timerDownNum = this.timerDownNum-1;
        this.labelTimer.setString(this.timerDownNum);
        if(this.timerDownNum<=0){
            this.unschedule(this.fNode.timerDown);
        }
    }   ,
    beginBangTimer:function(second){
        this.sprite.scheduleOnce(this.removeBang, second);
//        this.beginTimer(second);
    }   ,
    beginTimer: function (second) {
        this.sprite.scheduleOnce(this.removeSelf, second);
    },
    zhadanBang:function(){
        this.fNode.makeABangzhaAt(this.fNode.body.getPos());
        var audioEngine = cc.AudioEngine.getInstance();
        audioEngine.playEffect(s_m_bang);
        this.fNode.removeSelf();
    }   ,
    makeABangzhaAt:function(pos){
//        var emtter = cc.ParticleSystem.create(s_p_baozha);
        //
        var emtter = cc.ParticleSun.create();
        emtter.setAutoRemoveOnFinish(true);
        emtter.setDuration(1);
        emtter.setStartSize(24);
        emtter.getEndSize(-1);
        emtter.setPosition(pos);
        this.sprite.getParent().addChild(emtter);
        var myTexture = cc.TextureCache.getInstance().addImage(s_fire);
        emtter.setTexture(myTexture);

        var bangSpriteNode = new BangSpriteNode();
        bangSpriteNode.sprite.initWithFile(s_CloseNormal);
        bangSpriteNode.sprite.setOpacity(0);
        bangSpriteNode.initBaozha(pos,this.space);
        this.sprite.getParent().addChild(bangSpriteNode.sprite);
//        bangSprite.beginTimer(1);
        bangSpriteNode.beginBangTimer(1);

    },
    removeBang:function(){
        if(this.getParent().zhadans.length<=0){
            this.getParent().gameover = true;
        }
        this.fNode.removeSelf();
    }  ,
    removeSelf: function() {
        this.space.removeBody(this.body);
        this.space.removeShape(this.shape);
        this.sprite.removeFromParent();
    }

})  ;


var Helloworld = cc.Layer.extend({
    isMouseDown: false,
    helloImg: null,
    helloLabel: null,
    circle: null,
    sprite: null,

    init: function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.space = new cp.Space();
        //分割成控制区和 游戏区
        this.zhadans = [];
        this.addARandomZhadan();

        var labelTimer = cc.LabelTTF.create(this.zhadans[0], "Arial", 24);
        labelTimer.setPosition(cp.v(100,20));
        this.labelTimer = labelTimer;
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();
        this.winsize = size;
        // add a "close" icon to exit the progress. it's an autorelease object
        var kongzhiHeight = 50;
        this.kongzhiHeight = kongzhiHeight;
        this.youxiSize = cp.v(size.width,size.height-40);
        this.setTouchEnabled(true);
        var layer1 = cc.LayerColor.create(new cc.Color4B(34, 139, 34, 255), size.width, size.height);
        this.addChild(layer1);
        var layerKongzhi = cc.LayerColor.create(new cc.c4b(237,87,54,255),size.width,kongzhiHeight);
        layerKongzhi.addChild(labelTimer);
//        layerKongzhi.setPosition(cp.v(size.width/2,0));
        this.addChild(layerKongzhi);

        //
//        var rebutton = cc.MenuItemImage.create(s_r1, s_r2, this.onRestartCallback, this);
//        var menu = cc.Menu.create(rebutton);
//        layerKongzhi.addChild(menu);
//        menu.setPosition(cp.v(0,0));
//        rebutton.setPosition(cp.v(300,24));
        //
        this.initPhysics();
//        var sprite1 = this.addSpriteAtPositionAndVel(cp.v(size.width / 2, size.height / 2), cp.v(100, 0));
        this.addACandySprite();
//        sprite1.getBody().shapeList[0].setCollisionType(1);
//        var sprite2 = this.addSpriteAtPositionAndVel(cp.v(size.width / 2, size.height / 2), cp.v(100, 100));
//        sprite2.getBody().shapeList[0].setCollisionType(1);

        this.space.addCollisionHandler(1, 3, null, this.bangzheCandy, null, null);
//        var sprite =  this.createPhysicsSprite( pos );
//        this.addChild( sprite );
//        cc.log(sprite);
        //粒子效果

        this._emitter = cc.ParticleSystem.create(s_p_baozha);
        var bao =   this._emitter;
        bao._startSize = 10;
        this._emitter.setAutoRemoveOnFinish(true);
        this.addChild(this._emitter, 10);
        this._emitter.setShapeType(cc.PARTICLE_STAR_SHAPE);
//        this.setEmitterPosition();

        //
        this.gameover = false;
        this.scheduleUpdate();
        //score section
        this.score = 0;
        var labelscore = cc.LabelTTF.create("score:"+this.score, "Arial", 24);
        labelscore.setPosition(cp.v(200,20));
        this.labelscore = labelscore;
        layerKongzhi.addChild(labelscore);
        //
        var ls =sys.localStorage ;
        this.hightScore = ls.getItem("highscore")||0;
        var audioEngine = cc.AudioEngine.getInstance();
        audioEngine.preloadEffect(s_m_bang);
        return true;
    },
    onRestartCallback:function(){
        var dir = cc.Director.getInstance();
        if(dir.isPaused){
            this.gameover = false;
            dir.resume();

        }
        var s = new GameScene();
//        s.addChild(restartActionMgrTest());
        cc.Director.getInstance().replaceScene(s);
//        cc.Director.getInstance().resume();

    }   ,
    addARandomZhadan:function(){
        var zhadanTime = parseInt(Math.random()*4+2);
        cc.log(zhadanTime);
        this.zhadans.push(zhadanTime);
    }   ,
    addACandySprite:function(){
        var spriteNode = new BangSpriteNode();
        spriteNode.sprite.initWithFile(s_CloseNormal);
        var posX = Math.random()*this.winsize.width;
        var posY = Math.random()*(this.winsize.height-this.kongzhiHeight)+this.kongzhiHeight;
        var velX = Math.random()*150+20;
        var velY = Math.random()*150+20;
        spriteNode.initCandyWithSpace(cp.v(posX,posY), cp.v(velX,velY), this.space);
        this.addChild(spriteNode.sprite);
//        sprite.beginTimer(5);
        return spriteNode.sprite;
    }   ,
    bangzheCandy: function (arbs,space) {
        cc.log("bingo");
        var shapes = arbs.getShapes();
        var candy = shapes[0];
        var candySprite = candy.sprite ;

        candySprite.scheduleOnce(function(){
            var parentsLayer =  candySprite.getParent() ;
            parentsLayer.addACandySprite();
            parentsLayer.addARandomZhadan();
            parentsLayer.labelTimer.setString(parentsLayer.zhadans[0]);
            parentsLayer.score = parentsLayer.score+1;
            parentsLayer.labelscore.setString("score:"+parentsLayer.score);
            candySprite.fNode.removeSelf();

//            that.addACandySprite();

        },0);
//        space.addPostStepCallback(function(){
//            var parentsLayer =  candySprite.getParent() ;
//            parentsLayer.addACandySprite();
//            parentsLayer.addARandomZhadan();
//            parentsLayer.labelTimer.setString(parentsLayer.zhadans[0]);
//            parentsLayer.score = parentsLayer.score+1;
//            parentsLayer.labelscore.setString("score:"+parentsLayer.score);
//            candySprite.fNode.removeSelf();
//
////            that.addACandySprite();
//
//        });

        return 0;
    },

    update: function (delta) {
        this.space.step(delta);
//        var childSprite = this.getChildByTag(1001);
        var childrens = this.getChildren();
        for (index in childrens) {
            if (childrens[index].update) {
                childrens[index].update(delta);
            }

        }
        //game over ?
        if(this.gameover){
            cc.Director.getInstance().pause();
            this.addGameoverLayer();
        }

    },
    addGameoverLayer:function(){
        var gameoverLayer = cc.LayerColor.create(new cc.c4b(237,87,54,255),this.winsize.width,200);
//        layerKongzhi.addChild(labelTimer);
        gameoverLayer.setPosition(cp.v(0,this.winsize.height/2-100));
        this.addChild(gameoverLayer);
        var gameoverLable = cc.LabelTTF.create("Game Over", "Arial", 40);
        gameoverLable.setPosition(cp.v(this.winsize.width/2,150));
        gameoverLayer.addChild(gameoverLable);

        var newScoreLable = cc.LabelTTF.create("new score:"+this.score, "Arial", 20);
        newScoreLable.setPosition(cp.v(this.winsize.width-100,100));
        gameoverLayer.addChild(newScoreLable);
        if(this.score>this.hightScore){
            this.hightScore = this.score;
            sys.localStorage.setItem("highscore",this.hightScore);
        }
        var highScoreLable = cc.LabelTTF.create("high score:"+this.hightScore, "Arial", 20);
        highScoreLable.setPosition(cp.v(this.winsize.width-100,50));
        gameoverLayer.addChild(highScoreLable);

        var rebutton = cc.MenuItemImage.create(s_r1, s_r2, this.onRestartCallback, this);
        var menu = cc.Menu.create(rebutton);
        gameoverLayer.addChild(menu);
        menu.setPosition(cp.v(0,0));
        rebutton.setPosition(cp.v(80,40));

    }   ,
    addSpriteAtPositionAndVel: function (pos, vel) {
        var spriteNode = new BangSpriteNode();
        spriteNode.sprite.initWithFile(s_CloseNormal);
        spriteNode.initCandyWithSpace(pos, vel, this.space);
        this.addChild(spriteNode.sprite);
//        sprite.beginTimer(5);
        return spriteNode.sprite;
    },

    initPhysics: function () {
        var space = this.space;
        var staticBody = space.staticBody;
        var winSize = cc.Director.getInstance().getWinSize();
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

        // Gravity
//        space.gravity = cp.v(0, -100);
    },
    addSpriteAtPosition: function (pos) {
        var body = new cp.Body(1, cp.momentForCircle(1, 0, 24, cp.v(0, 0)));
        body.setPos(pos);
        body.setVel(cp.v(100, 20));
        this.space.addBody(body);
        var shape = new cp.CircleShape(body, 24, cp.v(0, 0));
        shape.setElasticity(1);
        shape.setFriction(0);
        this.space.addShape(shape);

        var sprite = cc.PhysicsSprite.create(s_CloseNormal);
//        sprite.setTextureRect(cc.rect(0,0,48,48));
//        sprite.setColor(new cc.c3b(100,0,0));
        sprite.setBody(body);
        this.addChild(sprite);
        return sprite;
    },
    // a selector callback
    menuCloseCallback: function (sender) {
        cc.Director.getInstance().end();
    },
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
        if(this.zhadans.length<=0){

            return;
        }
        var time = this.zhadans[0];
        cc.ArrayRemoveObjectAtIndex(this.zhadans,0);
        var spriteNode = new BangSpriteNode();
        spriteNode.sprite.initWithFile(s_Zhadan,cc.rect(0,0,48,48));
        spriteNode.initTheZhadan(pos,cp.v(0,0),this.space);
        this.addChild(spriteNode.sprite);
        spriteNode.zhadanTimer(time);
        if(this.zhadans.length<=0){

            this.labelTimer.setString("");
        }
    },
    onTouchesMoved: function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                //this.circle.setPosition(touches[0].getLocation().x, touches[0].getLocation().y);
            }
        }
    },
    onTouchesEnded: function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled: function (touches, event) {
        console.log("onTouchesCancelled");
    }
});

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new Helloworld();
        layer.init();
        this.addChild(layer);
    }
});