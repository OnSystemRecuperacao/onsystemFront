import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaOcorrenciaComponent } from './nova-ocorrencia.component';

describe('NovaOcorrenciaComponent', () => {
  let component: NovaOcorrenciaComponent;
  let fixture: ComponentFixture<NovaOcorrenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NovaOcorrenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaOcorrenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
