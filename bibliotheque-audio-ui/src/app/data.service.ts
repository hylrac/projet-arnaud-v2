import {Injectable} from '@angular/core'
import {Http} from '@angular/http'

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/filter'

import * as Model from './model'

let mock = {
  auteurs: [
    {
      id: 1,
      nom: 'Toto',
      maisonDeDisqueId: 1
    }
  ]
}

@Injectable()
export class DataService {
  constructor(private http: Http) {
  }

  artists(): Observable<Model.Auteur[]> {
    return this.http
      .get('http://localhost:8080/projet-arnaud-v2-1.0-SNAPSHOT/api/auteurs')
      .map(response => response.json() as Model.Auteur[])
  }

  searchArtist(term): Observable<Model.PossibleDiscogsArtistImport[]> {
    return this.http
      .get(`http://localhost:8080/projet-arnaud-v2-1.0-SNAPSHOT/api/discogs/searchArtists?q=${term}`)
      .map(response => response.json() as Model.PossibleDiscogsArtistImport[])
  }

  importArtist(discogsArtistId) {
    this.http
      .get(`http://localhost:8080/projet-arnaud-v2-1.0-SNAPSHOT/api/discogs/importArtistAsync?discogsArtistId=${discogsArtistId}`)
      .toPromise()
  }

  chansons(auteur: Model.Auteur): Observable<Model.Chanson[]> {

    return this.http
      .get(`http://localhost:8080/projet-arnaud-v2-1.0-SNAPSHOT/api/chansons/artist/${auteur.id}`)
      .map(response => response.json() as Model.Chanson[])
  }


}
