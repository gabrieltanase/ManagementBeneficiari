import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { CanDeactivate } from '@angular/router';

export interface UnsavedChanges {
  hasUnsavedChanges: () => boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesGuard  implements CanDeactivate<UnsavedChanges> {
  constructor(private confirmationService: ConfirmationService) {}

  canDeactivate(component: UnsavedChanges): Observable<boolean> | boolean {
    if (component.hasUnsavedChanges()) {
      return new Observable<boolean>(observer => {
        this.confirmationService.confirm({
          message: 'You have unsaved changes. Do you really want to leave?',
          header: 'Unsaved Changes',
          icon: 'pi pi-exclamation-triangle',
          accept: () => observer.next(true),
          reject: () => observer.next(false)
        });
      });
    }
    return true;
  }
}

