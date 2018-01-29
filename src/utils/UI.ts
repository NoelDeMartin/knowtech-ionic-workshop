import {
    Loading,
    AlertController,
    ModalController,
    LoadingController,
} from 'ionic-angular';

import Translator from './Translator';

import Config   from '@app/config.json';

import { resolveDependency } from './injector';

class UI {

    private loader: Loading;
    private alertCtrl: AlertController;
    private modalCtrl: ModalController;
    private loadingCtrl: LoadingController;

    asyncOperation(promise: Promise<any>): Promise<any> {

        this.showLoading();

        return promise
            .then(() => {
                this.hideLoading();
            })
            .catch((error: any) => {
                this.hideLoading();
                if (error instanceof Error) {
                    this.showError(error.message);
                } else {
                    if (Config.env == 'development') {
                        console.error(error);
                    }
                    this.showError(Translator.trans('errors.unknown'));
                }
            });
    }

    public showLoading(): void {

        if (!this.loadingCtrl) {
            this.loadingCtrl = resolveDependency(LoadingController);
        }

        if (this.loader) {
            this.loader.dismiss();
        }

        this.loader = this.loadingCtrl.create();
        this.loader.present();

    }

    public hideLoading(): void {
        if (this.loader) {
            this.loader.dismiss();
            this.loader = null;
        }
    }

    public showError(message: string): void {

        if (!this.alertCtrl) {
            this.alertCtrl = resolveDependency(AlertController);
        }

        this.alertCtrl.create({
            title: Translator.trans('errors.title'),
            message: message,
            buttons: [
                Translator.trans('errors.accept')
            ]
        }).present();

    }

    public showModal(modal: any): void {

        if (!this.modalCtrl) {
                this.modalCtrl = resolveDependency(ModalController);
            }

        this.modalCtrl.create(modal).present();

    }

    /**
     * Run some code after Angular's change detection. This is important
     * if any actions needs to directly manipulate DOM state.
     *
     * More information about angular's tick: https://angular.io/api/core/ApplicationRef#!#tick-anchor
     */
    public nextTick(callback: Function): void {
        setTimeout(callback, 0);
    }

    /**
     * There are multiple libraries available to animate properties in different ways,
     * but sometimes a simple implementation such as this can get the job done.
     */
    public animate(
        object: any,
        property: string,
        targetValue: number,
        duration: number = 1000
    ): void {

        let startValue: number = object[property];
        let start: number = Date.now();

        let animationRenderFrame = () => {

            let progress = Math.min((Date.now() - start) / duration, 1);
            object[property] = startValue + (targetValue - startValue) * progress;

            if (progress < 1) window.requestAnimationFrame(animationRenderFrame);

        };

        window.requestAnimationFrame(animationRenderFrame);

    }

}

export default new UI();