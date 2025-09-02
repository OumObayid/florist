import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerTitleComponent } from './banner-title.component';

describe('BannerTitleComponent', () => {
  let component: BannerTitleComponent;
  let fixture: ComponentFixture<BannerTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
