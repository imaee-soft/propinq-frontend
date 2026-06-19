import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AnswerContactRequest } from './interfaces/answer-contact-request.interface';
import { ContactDetailsPage } from './interfaces/contact-details-page.interface';
import { ContactDetails } from './interfaces/contact-details.interface';
import { ContactRequest } from './interfaces/contact-request.interface';
import { ContactResponse } from './interfaces/contact-response.interface';
import { RejectContactRequest } from './interfaces/reject-contact-request.interface';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/v1/contacts`;

  getTenantContactsDetails(page = 0, size = 6): Observable<ContactDetailsPage> {
    return this._http.get<ContactDetailsPage>(`${this._baseUrl}/tenant`, {
      params: { page, size },
    });
  }

  getOwnerContactsDetails(
    page = 0,
    size = 6,
    surname?: string,
    status = 'all',
  ): Observable<ContactDetailsPage> {
    return this._http.get<ContactDetailsPage>(`${this._baseUrl}/owner`, {
      params:
        surname && surname !== ''
          ? { page, size, surname, status }
          : { page, size, status },
    });
  }

  saveContactRequest(contactRequest: ContactRequest) {
    return this._http.post(`${this._baseUrl}`, contactRequest, {
      observe: 'response',
    });
  }

  getContact(contactId: string) {
    return this._http.get<ContactResponse>(`${this._baseUrl}/${contactId}`);
  }

  answerContact(contactId: string, answer: AnswerContactRequest) {
    return this._http.patch(`${this._baseUrl}/${contactId}/answer`, answer);
  }

  rejectContact(contactId: string, answer: RejectContactRequest) {
    return this._http.patch(`${this._baseUrl}/${contactId}/cancel`, answer);
  }

  deleteContact(contactId: string) {
    return this._http.delete(`${this._baseUrl}/${contactId}`);
  }

  getContactDetails(contactId: string) {
    return this._http.get<ContactDetails>(
      `${this._baseUrl}/${contactId}/details`,
    );
  }
}
