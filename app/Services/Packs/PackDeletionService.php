<?php

namespace Everest\Services\Packs;

use Everest\Contracts\Repository\PackRepositoryInterface;
use Everest\Exceptions\Service\HasActiveServersException;
use Everest\Contracts\Repository\ServerRepositoryInterface;

class PackDeletionService
{
    /**
     * PackDeletionService constructor.
     */
    public function __construct(
        protected ServerRepositoryInterface $serverRepository,
        protected PackRepositoryInterface $repository
    ) {
    }

    /**
     * Delete a pack from the system only if there are no servers attached to it.
     *
     * @throws \Everest\Exceptions\Service\HasActiveServersException
     */
    public function handle(int $pack): int
    {
        $count = $this->serverRepository->findCountWhere([['pack_id', '=', $pack]]);
        if ($count > 0) {
            throw new HasActiveServersException(trans('exceptions.pack.delete_has_servers'));
        }

        return $this->repository->delete($pack);
    }
}
