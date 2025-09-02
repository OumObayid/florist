import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartslideComponent } from './cartslide.component';

describe('CartslideComponent', () => {
  let component: CartslideComponent;
  let fixture: ComponentFixture<CartslideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartslideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartslideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
