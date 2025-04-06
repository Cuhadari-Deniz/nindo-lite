import { expect, it, vi } from "@effect/vitest";
import { Effect } from "effect";
import { InfluencerService } from "../../../src/domain/influencer/service";
import { InfluencerRepo } from "../../../src/domain/influencer/repository";
import { MockDataGeneratorService } from "../../../src/domain/mock-data-generator/service";

const mockGetAllData = [
  { id: "id1", externalId: "ex1" },
  { id: "id2", externalId: "ex2" },
  { id: "id3", externalId: "ex2" },
];

const MockInfluencerRepo = InfluencerRepo.make({
  update: vi.fn(),
  getAll: vi.fn().mockImplementation(() => mockGetAllData),
});

it.effect(
  "fetchAndUpdateDataForAll updated data for every mocked influencer",
  () =>
    Effect.gen(function* () {
      yield* InfluencerService.fetchAndUpdateDataForAll();

      expect(MockInfluencerRepo.getAll).toHaveBeenCalledOnce();
      expect(MockInfluencerRepo.update).toHaveBeenCalledTimes(
        mockGetAllData.length
      );
    }).pipe(
      Effect.provide(InfluencerService.Default),
      Effect.provide(MockDataGeneratorService.Default),
      Effect.provideService(InfluencerRepo, MockInfluencerRepo)
    )
);
