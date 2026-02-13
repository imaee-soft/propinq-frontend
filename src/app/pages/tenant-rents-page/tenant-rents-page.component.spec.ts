import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRentsPageComponent } from './tenant-rents-page.component';

describe('TenantRentsPageComponent', () => {
  let component: TenantRentsPageComponent;
  let fixture: ComponentFixture<TenantRentsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantRentsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantRentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
