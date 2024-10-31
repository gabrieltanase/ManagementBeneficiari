import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { CanDeactivate} from '@angular/router';

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
          message: 'Aveți modificări nesalvate. Sigur doriți să părăsiți pagina?',
          header: 'Modificări nesalvate',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Da',
          rejectLabel: 'Nu',
          acceptButtonStyleClass: 'bg-red-600 border-red-700 text-white hover:bg-red-800 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500',
          rejectButtonStyleClass: 'bg-green-500 border-green-600 text-white hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400',
          accept: () => observer.next(true),
          reject: () => observer.next(false)
        });
      });
    }
    return true;
  }
}

