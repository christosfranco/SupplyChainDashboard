import { TestBed } from '@angular/core/testing';

import { FilesNamesService } from './files-names.service';

describe('FilesNamesService', () => {
  let service: FilesNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
