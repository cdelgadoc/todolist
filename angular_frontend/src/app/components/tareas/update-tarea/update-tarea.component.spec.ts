import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTareaComponent } from './update-tarea.component';

describe('UpdateTareaComponent', () => {
  let component: UpdateTareaComponent;
  let fixture: ComponentFixture<UpdateTareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTareaComponent]
    });
    fixture = TestBed.createComponent(UpdateTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
