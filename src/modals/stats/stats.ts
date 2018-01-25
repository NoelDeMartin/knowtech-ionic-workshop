import { Component } from '@angular/core';

import { ChartDataPoint } from '@app/components/line-chart/line-chart';

@Component({
    selector: 'modal-stats',
    templateUrl: 'stats.html'
})
export class StatsModal {

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

}