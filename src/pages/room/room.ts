import {
    Component,
    ViewChild,
    ElementRef,
} from '@angular/core';
import {
    NavParams,
    AlertController,
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { PageAction } from '@app/components/page/page';

import { Chat } from '@app/providers/Chat';
import { Auth } from '@app/providers/Auth';

import { Room }     from '@app/models/Room';
import { Message }  from '@app/models/Message';
import { User }     from '@app/models/User';

import UI           from '@app/utils/UI';
import Translator   from '@app/utils/Translator';

@Component({
    selector: 'page-room',
    templateUrl: 'room.html'
})
export class RoomPage {

    @ViewChild('messages') messages: ElementRef;

    room: Room = null;
    roomMessages: Observable<Message[]> = null;

    message: string = '';

    actions: PageAction[] = [];

    private subscription: Subscription;

    constructor(
        private auth: Auth,
        private chat: Chat,
        private alertCtrl: AlertController,
        params: NavParams
    ) {
        this.room = params.get('room');
        this.roomMessages = this.chat.listenRoomMessages(this.room.id);

        this.actions.push({
            icon: 'person-add',
            callback: this.addMember.bind(this)
        });
    }

    get user(): User {
        return this.auth.getUser();
    }

    ionViewWillEnter() {
        let messagesCount = 0;
        this.subscription = this.roomMessages.subscribe((messages: Message[]) => {
            if (messagesCount < messages.length) {
                messagesCount = messages.length;
                UI.nextTick(this.scrollToBottom.bind(this));
            }
        });
    }

    ionViewWillLeave() {
        this.subscription.unsubscribe();
    }

    public sendMessage(): void {
        UI.asyncOperation(this.chat.sendMessage(this.room.id, this.message));
        this.message = '';
    }

    public addMember(): void {
        this.alertCtrl.create({
            title: 'Add member',
            inputs: [
                {
                    name: 'username',
                    placeholder: Translator.trans('add-member.username')
                }
            ],
            buttons: [
                {
                    text: Translator.trans('add-member.cancel'),
                    role: 'cancel'
                },
                {
                    text: Translator.trans('add-member.submit'),
                    handler: ({ username }) => {
                        UI.asyncOperation(
                            this.chat
                                .addRoomMember(this.room.id, username)
                                .then((userId: string) => {
                                    this.room.memberIds.push(userId);
                                })
                        );
                    }
                }
            ]
        }).present();
    }

    private scrollToBottom(): void {

        let element = this.messages.nativeElement;

        if (isDivElement(element)) {
            let scroll: HTMLElement = element.parentElement;
            UI.animate(scroll, 'scrollTop', scroll.scrollHeight - scroll.clientHeight, 300);
        }

    }

}

function isDivElement(object: any): object is HTMLDivElement {
    return object instanceof HTMLDivElement;
}