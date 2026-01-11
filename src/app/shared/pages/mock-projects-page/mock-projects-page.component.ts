import { Component } from '@angular/core';
import { Page } from '../../interfaces/page.interface';
import mockPage from './mock-projects.json';
import { CardDescriptor } from '../../interfaces/card-descriptor.interface';
import { CommonEntityPageComponent } from '../common-entity-page/common-entity-page.component';

interface Project {
  id: string;
  title: string;
  description: string;
  owner: string;
  propertyName: string;
  createdAt: string;
  lat: number;
  lng: number;
  status?: string;
}

@Component({
  selector: 'app-mock-projects-page',
  imports: [CommonEntityPageComponent],
  templateUrl: './mock-projects-page.component.html',
  styleUrl: './mock-projects-page.component.css',
})
export class MockProjectsPageComponent {
  page = mockPage as Page<Project>;

  descriptor: CardDescriptor<Project> = {
    user: (p) => p.owner,
    name: (p) => p.propertyName,
    date: (p) => new Date(p.createdAt),
    id: (p) => p.id,
    status: (p) => p.status,
    coordinates: (p) => ({ latitude: p.lat, longitude: p.lng }),
  };

  openProject(id: string | number | undefined) {
    console.log('OPEN', id);
    alert(`Acceder a proyecto ${id}`);
  }

  deleteProject(id: string | number | undefined) {
    console.log('DELETE', id);
    alert(`Borrar proyecto ${id}`);
  }
}
