import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { CreateRoomModal } from '@app/modals/create-room/create-room';

import { Chat } from '@app/providers/Chat';
import { Auth } from '@app/providers/Auth';

import { Room }     from '@app/models/Room';
import { Message }  from '@app/models/Message';
import { User }     from '@app/models/User';

import UI from '@app/utils/UI';

@Component({
    selector: 'page-room',
    templateUrl: 'room.html'
})
export class RoomPage {

    room: Room = null;
    roomMessages: Observable<Message[]> = null;

    message: string = '';

    constructor(private auth: Auth, private chat: Chat, params: NavParams) {
        this.room = params.get('room');
        this.roomMessages = this.chat.listenRoomMessages(this.room.id);
    }

    get user(): User {
        return this.auth.getUser();
    }

    public sendMessage(): void {
        UI.asyncOperation(this.chat.sendMessage(this.room.id, this.message));
        this.message = '';
    }

}
