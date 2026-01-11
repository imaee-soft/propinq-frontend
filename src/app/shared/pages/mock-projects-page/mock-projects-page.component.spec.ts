import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockProjectsPageComponent } from './mock-projects-page.component';

describe('MockProjectsPageComponent', () => {
  let component: MockProjectsPageComponent;
  let fixture: ComponentFixture<MockProjectsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockProjectsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockProjectsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
