import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';

import { environment } from '../environments/environment'

import {VirtualScrollerModule} from 'ngx-virtual-scroller';
import {TranslationModule, L10nConfig, L10nLoader, ProviderType, L10N_CONFIG, L10nConfigRef} from 'angular-l10n';
import {MomentModule} from 'angular2-moment';
import {Angulartics2Module} from 'angulartics2';
import {Angulartics2Piwik} from 'angulartics2/piwik';
import {LinkyModule} from 'ngx-linky';
import {MetaModule, MetaLoader, MetaStaticLoader, PageTitlePositioning} from '@ngx-meta/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {AppNavComponent} from './app-nav.component';
import {ConnectingPopupComponent} from './servers/connecting-popup.component';
import {HomeComponent} from './home/home.component';
import {HomeTweetComponent} from './home/home-tweet.component';
import {SettingsComponent} from './settings/settings.component';

import {ServersComponent} from './servers/components/servers.component';
import {ServersContainerComponent} from './servers/components/servers-container.component';
import {ServersListComponent} from './servers/components/servers-list.component';
import {ServersListItemComponent} from './servers/components/servers-list-item.component';
import {ServersListHeaderComponent} from './servers/components/servers-list-header.component';
import {ServerFilterComponent} from './servers/components/server-filter.component';
import {ServerTagFilterComponent} from './servers/components/server-tag-filter.component';
import {ServersDetailComponent} from './servers/components/servers-detail.component';
import {PlayerAvatarComponent} from './servers/components/player-avatar.component';
import {DirectConnectComponent} from './servers/direct/direct-connect.component';

import {ServersService} from './servers/servers.service';
import {TweetService} from './home/tweet.service';
import {TrackingService} from './tracking.service';

import {GameService, CfxGameService, DummyGameService} from './game.service';
import {DiscourseService} from './discourse.service';

import {ColorizePipe} from './colorize.pipe';
import {EscapePipe} from './escape.pipe';
import { LocalStorage } from './local-storage';

const l10nConfig: L10nConfig = {
	locale: {
		languages: [
			{ code: 'en', dir: 'ltr' }
		],
		language: 'en'
	},
	translation: {
		providers: [] // see AppModule constructor
	}
};

export function localStorageFactory() {
	return (typeof window !== 'undefined') ? window.localStorage : null;
}

export function metaFactory(): MetaLoader {
	return new MetaStaticLoader({
		pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
		pageTitleSeparator: ' / ',
		applicationName: 'FiveM server list'
	});
}

@NgModule({
	declarations: [
		AppComponent,
		AppNavComponent,
		ConnectingPopupComponent,
		HomeComponent,
		HomeTweetComponent,
		SettingsComponent,
		ServersComponent,
		ServersContainerComponent,
		ServersListComponent,
		ServersListItemComponent,
		ServersListHeaderComponent,
		ServerFilterComponent,
		ServerTagFilterComponent,
		ServersDetailComponent,
		DirectConnectComponent,
		PlayerAvatarComponent,
		ColorizePipe,
		EscapePipe
	],
	imports:      [
		BrowserModule.withServerTransition({ appId: 'cfx-ui' }),
		FormsModule,
		HttpModule,
		AppRoutingModule,
		VirtualScrollerModule,
		MomentModule,
		HttpClientModule,
		TranslationModule.forRoot(l10nConfig),
		Angulartics2Module.forRoot(),
		LinkyModule,
		MetaModule.forRoot({
			provide: MetaLoader,
			useFactory: (metaFactory)
		}),
	],
	providers:    [
		ServersService,
		TweetService,
		{
			provide:  GameService,
			useClass: ((environment.production && !environment.web) || environment.game)
				? CfxGameService
				: DummyGameService
		},
		TrackingService,
		DiscourseService,
		{
			provide: LocalStorage,
			useFactory: (localStorageFactory)
		}
	],
	bootstrap:    [
		AppComponent
	]
})
export class AppModule {
	constructor(public l10nLoader: L10nLoader, @Inject(L10N_CONFIG) private configuration: L10nConfigRef) {
		const localePrefix = (environment.web) ? 'https://servers.fivem.net/' : './';

		this.configuration.translation.providers = [
			{ type: ProviderType.Static, prefix: localePrefix + 'assets/locale-' }
		];

		this.l10nLoader.load();
	}
}
