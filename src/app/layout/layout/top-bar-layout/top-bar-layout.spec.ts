import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarLayout } from './top-bar-layout';

describe('TopBarLayout', () => {
  let component: TopBarLayout;
  let fixture: ComponentFixture<TopBarLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBarLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
