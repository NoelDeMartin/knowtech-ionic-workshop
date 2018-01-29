import Message from "./Message";
import User from "./User";

let roomsCount = 0;
function generateId(): string {
    return (++roomsCount).toString();
}

export default class Room {

    private id: string;
    private topic: string;
    private creatorId: string;
    private memberIds: string[];
    private messages: Message[];

    constructor(topic: string, creatorId: string, memberIds: string[]) {
        this.id = generateId();
        this.topic = topic;
        this.creatorId = creatorId;
        this.memberIds = memberIds;
        this.messages = [];
    }

    public getId(): string {
        return this.id;
    }

    public getMessages(): Message[] {
        return this.messages;
    }

    public addMessage(text: string, authorId: string): Message {
        let message = new Message(text, authorId, Date.now());
        this.messages.push(message);
        return message;
    }

    public addMember(user: User): void {
        this.memberIds.push(user.getId());
    }

    public hasMember(userId: string): boolean {
        return this.memberIds.indexOf(userId) !== -1;
    }

    public toJson(): Object {
        return {
            id: this.id,
            topic: this.topic,
            creator_id: this.creatorId,
            member_ids: this.memberIds
        };
    }

}