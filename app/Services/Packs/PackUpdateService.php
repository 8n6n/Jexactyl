<?php

namespace Everest\Services\Packs;

use Everest\Contracts\Repository\PackRepositoryInterface;

class PackUpdateService
{
    /**
     * PackUpdateService constructor.
     */
    public function __construct(protected PackRepositoryInterface $repository)
    {
    }

    /**
     * Update a pack and prevent changing the author once it is set.
     *
     * @throws \Everest\Exceptions\Model\DataValidationException
     * @throws \Everest\Exceptions\Repository\RecordNotFoundException
     */
    public function handle(int $pack, array $data): void
    {
        if (!is_null(array_get($data, 'author'))) {
            unset($data['author']);
        }

        $this->repository->withoutFreshModel()->update($pack, $data);
    }
}
