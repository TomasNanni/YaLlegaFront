import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditProduct } from './new-edit-product';

describe('NewEditProduct', () => {
  let component: NewEditProduct;
  let fixture: ComponentFixture<NewEditProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEditProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEditProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
