import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoindataComponent } from './coindata.component';

describe('CoindataComponent', () => {
  let component: CoindataComponent;
  let fixture: ComponentFixture<CoindataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoindataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoindataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
