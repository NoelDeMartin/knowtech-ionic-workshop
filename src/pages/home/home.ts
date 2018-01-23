import { Component }    from '@angular/core';

import { CreateRoomModal }  from '../../modals/create-room/create-room';

import UI   from '../../utils/UI';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public createRoom(): void {
        UI.showModal(CreateRoomModal);
    }

}
