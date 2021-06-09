import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownpaneComponent } from './downpane.component';

describe('DownpaneComponent', () => {
  let component: DownpaneComponent;
  let fixture: ComponentFixture<DownpaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownpaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownpaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
