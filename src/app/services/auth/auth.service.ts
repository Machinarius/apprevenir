import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { storeAuhToken, clearAuthStore, storeProfileInfo } from "./authStore";
// import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;

  token = localStorage.getItem('token');

  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.token
  })

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  login(credentials) {

    return this.http.post(`${this.url}/api/v1/login`, credentials).subscribe(
      res => {
        const accessToken = res["data"].access_token;
        const profileObject = res["data"].profile;
        profileObject.email = credentials["email"]; // Bruh...

        storeAuhToken(accessToken);
        storeProfileInfo(profileObject);

        this.router.navigate(['app/home']); 
      }, error => {

        // Swal.fire(
        //   'Error',
        //   error.error.data,
        //   'error'
        // )
      });
  }

  logout() {
    
    this.http.get(`${this.url}/api/v1/logout`, {headers: this.headers}).subscribe(
      res => {
        clearAuthStore();
        this.router.navigate(['/']);
      }, error => {
        
        // Swal.fire(
        //   'Error',
        //   error.error.data,
        //   'error'
        // )
        this.router.navigate(['/']);
      });
  }
}
