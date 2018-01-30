import { Component } from '@angular/core';

import {
    NavParams,
    ViewController,
} from 'ionic-angular';

import { Chat } from '@app/providers/Chat';

import UI from '@app/utils/UI';

import Modal from '../Modal';

@Component({
    selector: 'modal-create-room',
    templateUrl: 'create-room.html'
})
export class CreateRoomModal extends Modal {

    private topic: string = '';
    private members: string[] = [''];

    constructor(
        private chat: Chat,
        viewCtrl: ViewController,
        navParams: NavParams
    ) {
        super(viewCtrl, navParams);
    }

    public submit(): void {
        UI.asyncOperation(
            this.chat
                .createRoom(this.topic, this.members)
                .then(() => {
                    this.complete();
                })
        );
    }

    get memberIndexes(): number[] {
        return Object.keys(this.members).map((key: string) => {
            return parseInt(key);
        });
    }

}