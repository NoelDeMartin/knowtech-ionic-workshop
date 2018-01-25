import {
    Component,
    ViewChild,
    ElementRef,
} from '@angular/core';

import {
    NavParams,
    IonicPage,
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
import AsyncProvider from '@app/providers/AsyncProvider';

@IonicPage({
    name: 'room',
    segment: 'room/:id',
    defaultHistory: [ 'home' ]
})
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

    private ready: Promise<void>;
    private subscription: Subscription;

    constructor(
        private auth: Auth,
        private chat: Chat,
        private alertCtrl: AlertController,
        params: NavParams
    ) {
        this.actions.push({
            icon: 'person-add',
            callback: this.addMember.bind(this)
        });

        this.ready = AsyncProvider.sync(auth, chat).then(() => {
            let roomId = params.get('id');
            let subscription = this.chat.rooms.subscribe((rooms: Room[]) => {
                if (this.room) {
                    subscription.unsubscribe();
                }
                for (let room of rooms) {
                    if (room.id == roomId) {
                        this.room = room;
                        this.roomMessages = this.chat.listenRoomMessages(this.room.id);
                        break;
                    }
                }
            });
        });
    }

    get user(): User {
        return this.auth.getUser();
    }

    ionViewWillEnter() {
        this.ready.then(() => {
            let messagesCount = 0;
            this.subscription = this.roomMessages.subscribe((messages: Message[]) => {
                if (messagesCount < messages.length) {
                    messagesCount = messages.length;
                    UI.nextTick(this.scrollToBottom.bind(this));
                }
            });
        })
    }

    ionViewWillLeave() {
        this.ready.then(() => {
            if (this.subscription) {
                this.subscription.unsubscribe();
                this.subscription = null;
            }
        });
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