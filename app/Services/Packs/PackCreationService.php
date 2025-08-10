<?php

namespace Everest\Services\Packs;

use Ramsey\Uuid\Uuid;
use Everest\Models\Pack;
use Everest\Contracts\Repository\PackRepositoryInterface;
use Illuminate\Contracts\Config\Repository as ConfigRepository;

class PackCreationService
{
    /**
     * PackCreationService constructor.
     */
    public function __construct(private ConfigRepository $config, private PackRepositoryInterface $repository)
    {
    }

    /**
     * Create a new pack on the system.
     *
     * @throws \Everest\Exceptions\Model\DataValidationException
     */
    public function handle(array $data, string $author = null): Pack
    {
        return $this->repository->create([
            'uuid' => Uuid::uuid4()->toString(),
            'author' => $author ?? $this->config->get('everest.service.author'),
            'name' => array_get($data, 'name'),
            'description' => array_get($data, 'description'),
        ], true, true);
    }
}
