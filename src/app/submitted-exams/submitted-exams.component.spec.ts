import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedExamsComponent } from './submitted-exams.component';

describe('SubmittedExamsComponent', () => {
  let component: SubmittedExamsComponent;
  let fixture: ComponentFixture<SubmittedExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmittedExamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmittedExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
