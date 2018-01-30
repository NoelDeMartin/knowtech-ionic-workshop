import { Component } from '@angular/core';

import { ChartDataPoint } from '@app/components/line-chart/line-chart';

import Modal from '../Modal';
import {
    NavParams,
    ViewController,
} from 'ionic-angular';

@Component({
    selector: 'modal-stats',
    templateUrl: 'stats.html'
})
export class StatsModal extends Modal {

    // Fake data
    messagesData: ChartDataPoint[] = [
        {
            label: '1 Jan',
            value: 123
        },
        {
            label: '2 Jan',
            value: 50
        },
        {
            label: '3 Jan',
            value: 72
        },
        {
            label: '4 Jan',
            value: 72
        },
        {
            label: '5 Jan',
            value: 22
        }
    ];

    constructor(viewCtrl: ViewController, navParams: NavParams) {
        super(viewCtrl, navParams);
    }

}