import { TestBed } from '@angular/core/testing';

import { ValidarUsuarioGuard } from './validar-usuario.guard';

describe('ValidarUsuarioGuard', () => {
  let guard: ValidarUsuarioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ValidarUsuarioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
