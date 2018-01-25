import {
    Component,
    ViewChild,
    ElementRef,
    Input,
} from '@angular/core';

import * as ChartJS from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

export type ChartDataPoint = {
    label: string,
    value: number
};

@Component({
    selector: 'line-chart',
    templateUrl: './line-chart.html',
})
export class LineChart {

    @ViewChild('canvas') canvas: ElementRef;

    @Input() name: string = '';
    @Input() data: ChartDataPoint[] = [];

    chart: Chart;

    ngAfterViewInit() {
        let context = <CanvasRenderingContext2D> (<HTMLCanvasElement> this.canvas.nativeElement).getContext('2d');
        this.chart = new ChartJS(context, {
            type: 'line',
            data: this.buildChartData(),
            options: this.buildChartOptions(),
        });
    }

    private buildChartData(): ChartData {
        return {
            labels: this.data.map((datum: ChartDataPoint) => datum.label),
            datasets: [{
                label: this.name,
                data: this.data.map((datum: ChartDataPoint) => datum.value)
            }]
        };
    }

    private buildChartOptions(): ChartOptions {
        return {};
    }

}