import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageSectionsComponent } from './homepage-sections.component';

describe('HomepageSectionsComponent', () => {
  let component: HomepageSectionsComponent;
  let fixture: ComponentFixture<HomepageSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageSectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
