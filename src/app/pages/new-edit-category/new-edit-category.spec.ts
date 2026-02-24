import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditCategory } from './new-edit-category';

describe('NewEditCategory', () => {
  let component: NewEditCategory;
  let fixture: ComponentFixture<NewEditCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEditCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEditCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
