import { Component } from '@angular/core'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'

import { DataService } from './data.service'
import * as Model from './model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  auteurs: Observable<Model.Auteur[]>;
  selectedChansons: Observable<Model.Chanson[]>;
  selectedAuteur: Model.Auteur ;

  searchArtistToImport: string
  artistSearchTerms = new Subject<string>()
  importableArtists: Observable<Model.PossibleDiscogsArtistImport[]>


  constructor(private dataService: DataService) {
    this.auteurs = this.dataService.artists();

    this.importableArtists = this.artistSearchTerms
      .debounceTime(2500)
      .distinctUntilChanged()
      .switchMap(term => term ? this.dataService.searchArtist(term) : Observable.of<Model.PossibleDiscogsArtistImport[]>([]))
      .catch(error => {
        console.log(error)
        return Observable.of<Model.PossibleDiscogsArtistImport[]>([]);
      })
  }

  rechercheArtiste(term: string): void {
    this.artistSearchTerms.next(term)
  }

  putSelectedAuteur(auteur : Model.Auteur) : void {
    if (this.selectedAuteur === auteur) {
      this.selectedAuteur=undefined;
    } else {
      this.selectedAuteur = auteur;
    };
  }

  importArtist(artist: Model.PossibleDiscogsArtistImport) {
    this.dataService.importArtist(artist.discogId)
  }

  putSelectedChansons (auteur : Model.Auteur)  {
    if (this.selectedAuteur != auteur) this.selectedChansons = this.dataService.chansons(auteur);
  }
}
