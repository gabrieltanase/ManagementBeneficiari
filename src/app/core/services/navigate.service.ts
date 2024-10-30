import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  /**
   * Navigate to a given route path with optional params and queryParams.
   * @param path Array representing the route path (e.g., `['beneficiaries', 'edit', id]`)
   * @param extras Optional NavigationExtras for additional query parameters, state, etc.
   * @returns A promise resolving to `true` on successful navigation, or rejecting with an error message.
   */
  navigateTo(path: any[], extras?: NavigationExtras): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.router.navigate(path, extras)
        .then(success => {
          success ? resolve(true) : reject('Navigation failed');
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
