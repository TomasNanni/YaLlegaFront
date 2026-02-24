import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductItem } from './new-product-item';

describe('NewProductItem', () => {
  let component: NewProductItem;
  let fixture: ComponentFixture<NewProductItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProductItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProductItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
