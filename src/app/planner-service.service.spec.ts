import { TestBed, inject } from '@angular/core/testing';

import { PlannerServiceService } from './planner-service.service';

describe('PlannerServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlannerServiceService]
    });
  });

  it('should be created', inject([PlannerServiceService], (service: PlannerServiceService) => {
    expect(service).toBeTruthy();
  }));
});
