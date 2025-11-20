import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinedCoursesComponent } from './joined-courses.component';

describe('JoinedCoursesComponent', () => {
  let component: JoinedCoursesComponent;
  let fixture: ComponentFixture<JoinedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinedCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
