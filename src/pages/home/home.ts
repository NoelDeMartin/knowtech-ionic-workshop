import { Component }    from '@angular/core';

import { NavController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { CreateRoomModal }  from '@app/modals/create-room/create-room';

import { Chat } from '@app/providers/Chat';
import { Auth } from '@app/providers/Auth';

import { Room } from '@app/models/Room';

import { RoomPage } from '@app/pages/room/room';
import { LoginPage } from '@app/pages/login/login';

import {
    PageAction,
    PageOption,
} from '@app/components/page/page';

import UI           from '@app/utils/UI';
import Translator   from '@app/utils/Translator';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    actions: PageAction[] = [];
    options: PageOption[] = [];

    constructor(
        private navCtrl: NavController,
        private chat: Chat,
        private auth: Auth
    ) {

        this.actions.push({
            icon: 'add',
            callback: this.createRoom.bind(this)
        });

        this.options.push({
            text: Translator.trans('home.logout'),
            callback: this.logout.bind(this)
        });

    }

    get rooms(): Observable<Room[]> {
        return this.chat.rooms;
    }

    public openRoom(room: Room): void {
        this.navCtrl.push(RoomPage, { room: room });
    }

    public createRoom(): void {
        UI.showModal(CreateRoomModal);
    }

    public logout(): void {
        UI.asyncOperation(
            this.auth
                .logout()
                .then(() => {
                    this.navCtrl.setRoot(LoginPage);
                })
        );
    }

}
