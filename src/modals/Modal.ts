import {
    NavParams,
    ViewController,
} from "ionic-angular";

export default abstract class Modal {

    private resolve: Function;
    private reject: Function;

    constructor(private viewCtrl: ViewController, navParams: NavParams) {
        this.resolve = navParams.get('resolve');
        this.reject = navParams.get('reject');
    }

    public close(): void {
        if (this.resolve) this.resolve();
    }

    public complete(result?: any): void {
        if (this.resolve) this.resolve(result);
        this.viewCtrl.dismiss();
    }

    public fail(error?: any): void {
        if (this.reject) this.reject(error);
    }

}