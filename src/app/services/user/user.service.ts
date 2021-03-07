import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.url;

  token = localStorage.getItem('token');

  profile = JSON.parse(localStorage.getItem('profile'));

  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.token
  })

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  register(data) {

    return this.http.post(`${this.url}/api/v1/register`, data).subscribe(
      res => {

        Swal.fire(
          'Guardado',
          'Usuario registrado correctamente',
          'success'
        )   
        this.router.navigate(['/']);
        
      }, data => {

       Swal.fire(
          'Error',
          data.errors,
          'error'
        )
      });
  }

  updateProfile(data) {

    if (this.profile) {

      return this.http.put(`${this.url}/api/v1/users/${this.profile.id}`, data, {headers: this.headers}).subscribe(
        res => {

          data.id = this.profile.id;
          localStorage.removeItem('profile');
          localStorage.setItem('profile', data); 
          // Swal.fire(
          //   'Guardado',
          //   ''Perfil actualizado',
          //   'success'
          // )   
          return data;

        }, error => {

          if (error.error.data == 'disabled') {

            localStorage.removeItem('token');
            localStorage.removeItem('profile');
            // Swal.fire(
            //   'Error',
            //   error.error.data,
            //   'error'
            // )
            this.router.navigate(['/']);
          }
        });

    } else {

      // Swal.fire(
      //   'Error',
      //   error.error.data,
      //   'error'
      // )
      this.router.navigate(['/']);
    }
  }

  client(data) {

    return this.http.post(`${this.url}/api/v1/register`, data).subscribe(
      res => {

        // Swal.fire(
        //   'Guardado',
        //   'Usuario registrado correctamente',
        //   'success'
        // )   
        this.router.navigate(['app/edit-client']);
        
      }, data => {

       // Swal.fire(
        //   'Error',
        //   error.error.data,
        //   'error'
        // )
      });
  }

  getUsers() {
    return this.http.get(`${this.url}/api/v1/users`, {headers: this.headers});
  }

  getClientsList(clientType) {

    return this.http.get(`${this.url}/api/v1/clients?client=${clientType}`);
  }

  countries() {

    return this.http.get(`${this.url}/api/v1/countries`);
  }

  states(country) {

    return this.http.get(`${this.url}/api/v1/states?country=`+country);
  }

  cities(state) {

    return this.http.get(`${this.url}/api/v1/cities?state=`+state);
  }
}
