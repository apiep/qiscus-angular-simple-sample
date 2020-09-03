import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QiscusComponent } from './qiscus.component';

describe('QiscusComponent', () => {
  let component: QiscusComponent;
  let fixture: ComponentFixture<QiscusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QiscusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QiscusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
