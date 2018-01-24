import { Component }    from '@angular/core';

import { NavController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { CreateRoomModal }  from '@app/modals/create-room/create-room';

import { Chat } from '@app/providers/Chat';

import { Room } from '@app/models/Room';

import { RoomPage } from '@app/pages/room/room';

import UI   from '@app/utils/UI';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(private navCtrl: NavController, private chat: Chat) { }

    get rooms(): Observable<Room[]> {
        return this.chat.rooms;
    }

    public openRoom(room: Room): void {
        this.navCtrl.push(RoomPage, { room: room });
    }

    public createRoom(): void {
        UI.showModal(CreateRoomModal);
    }

}
