import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

require('zone.js/dist/zone');

window.onload = () => {
    platformBrowserDynamic().bootstrapModule(AppModule);
};