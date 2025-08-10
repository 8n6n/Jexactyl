<?php

namespace Everest\Http\Controllers\Api\Application\Packs;

use Everest\Models\Pack;
use Everest\Facades\Activity;
use Illuminate\Http\Response;
use Spatie\QueryBuilder\QueryBuilder;
use Everest\Services\Packs\PackUpdateService;
use Everest\Services\Packs\PackCreationService;
use Everest\Services\Packs\PackDeletionService;
use Everest\Services\Eggs\Sharing\EggImporterService;
use Everest\Transformers\Api\Application\EggTransformer;
use Everest\Transformers\Api\Application\PackTransformer;
use Everest\Exceptions\Http\QueryValueOutOfRangeHttpException;
use Everest\Http\Requests\Api\Application\Packs\GetPackRequest;
use Everest\Http\Requests\Api\Application\Eggs\ImportEggRequest;
use Everest\Http\Requests\Api\Application\Packs\GetPacksRequest;
use Everest\Http\Requests\Api\Application\Packs\StorePackRequest;
use Everest\Http\Requests\Api\Application\Packs\DeletePackRequest;
use Everest\Http\Requests\Api\Application\Packs\UpdatePackRequest;
use Everest\Http\Controllers\Api\Application\ApplicationApiController;

class PackController extends ApplicationApiController
{
    /**
     * PackController constructor.
     */
    public function __construct(
        private PackCreationService $packCreationService,
        private PackDeletionService $packDeletionService,
        private PackUpdateService $packUpdateService,
        private EggImporterService $eggImporterService
    ) {
        parent::__construct();
    }

    /**
     * Return all Packs that exist on the Panel.
     */
    public function index(GetPacksRequest $request): array
    {
        $perPage = (int) $request->query('per_page', '20');
        if ($perPage > 100) {
            throw new QueryValueOutOfRangeHttpException('per_page', 1, 100);
        }

        $packs = QueryBuilder::for(Pack::query())
            ->allowedFilters(['id', 'name', 'author'])
            ->allowedSorts(['id', 'name', 'author']);
        if ($perPage > 0) {
            $packs = $packs->paginate($perPage);
        }

        return $this->fractal->collection($packs)
            ->transformWith(PackTransformer::class)
            ->toArray();
    }

    /**
     * Return information about a single Pack model.
     */
    public function view(GetPackRequest $request, Pack $pack): array
    {
        return $this->fractal->item($pack)
            ->transformWith(PackTransformer::class)
            ->toArray();
    }

    /**
     * Creates a new pack.
     *
     * @throws \Everest\Exceptions\Model\DataValidationException
     */
    public function store(StorePackRequest $request): array
    {
        $pack = $this->packCreationService->handle($request->validated());

        Activity::event('admin:packs:create')
            ->property('pack', $pack)
            ->description('A pack was created')
            ->log();

        return $this->fractal->item($pack)
            ->transformWith(PackTransformer::class)
            ->toArray();
    }

    /**
     * Imports an egg.
     */
    public function import(ImportEggRequest $request, Pack $pack): array
    {
        $egg = $this->eggImporterService->handleContent(
            $pack->id,
            $request->getContent(),
            $request->headers->get('Content-Type'),
        );

        Activity::event('admin:packs:import')
            ->property('egg', $egg)
            ->property('pack', $pack)
            ->description('An egg was imported to a pack')
            ->log();

        return $this->fractal->item($egg)
            ->transformWith(EggTransformer::class)
            ->toArray();
    }

    /**
     * Updates an existing pack.
     *
     * @throws \Everest\Exceptions\Model\DataValidationException
     * @throws \Everest\Exceptions\Repository\RecordNotFoundException
     */
    public function update(UpdatePackRequest $request, Pack $pack): array
    {
        $this->packUpdateService->handle($pack->id, $request->validated());

        Activity::event('admin:packs:update')
            ->property('pack', $pack)
            ->property('new_data', $request->all())
            ->description('A pack was updated')
            ->log();

        return $this->fractal->item($pack)
            ->transformWith(PackTransformer::class)
            ->toArray();
    }

    /**
     * Deletes an existing pack.
     *
     * @throws \Everest\Exceptions\Service\HasActiveServersException
     */
    public function delete(DeletePackRequest $request, Pack $pack): Response
    {
        $this->packDeletionService->handle($pack->id);

        Activity::event('admin:packs:delete')
            ->property('pack', $pack)
            ->description('A pack was deleted')
            ->log();

        return $this->returnNoContent();
    }
}
