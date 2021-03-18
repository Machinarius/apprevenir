import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSystemUserFormComponent } from './edit-system-user-form.component';

describe('EditSystemUserFormComponent', () => {
  let component: EditSystemUserFormComponent;
  let fixture: ComponentFixture<EditSystemUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSystemUserFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSystemUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
