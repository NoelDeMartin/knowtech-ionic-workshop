import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app.module';

require('zone.js/dist/zone');

window.onload = function() {
    platformBrowserDynamic().bootstrapModule(AppModule);
};