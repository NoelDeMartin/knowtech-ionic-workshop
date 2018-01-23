export interface RoomJson {
    id: string;
    topic: string;
    member_ids: string[];
}

export class Room {

    public readonly id: string;
    public readonly topic: string;
    public readonly memberIds: string[];

    constructor(json: RoomJson) {
        this.id = json.id;
        this.topic = json.topic;
        this.memberIds = json.member_ids;
    }

}