var cocos2dApp = cc.Application.extend({
    config: document['ccConfig'],
    ctor: function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.setup(this.config['tag']);

        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        // cc.Loader.shareLoader().onloading = function () {
        //     cc.LoaderScene.shareLoaderScene().draw();
        // };
        // cc.Loader.shareLoader().onload = function () {
        //     cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        // };
        // cc.Loader.shareLoader().preload([
        // ]);
    },
    applicationDidFinishLaunching: function () {

        var director = cc.Director.getInstance();
        director.setDisplayStats(this.config['showFPS']);
        director.setAnimationInterval(1.0 / this.config['frameRate']);
        cc.LoaderScene.preload(g_resources, function () {
            director.replaceScene(new this.startScene());
        }, this);

        // cc.EGLView.getInstance().setDesignResolutionSize(600, 600, cc.RESOLUTION_POLICY.EXACT_FIT);
        return true;
    }
});
var myApp = new cocos2dApp(MyFifthAppScene);