<?php

namespace Everest\Contracts\Repository;

use Everest\Models\Pack;
use Illuminate\Database\Eloquent\Collection;

interface PackRepositoryInterface extends RepositoryInterface
{
    /**
     * Return a pack or all packs with their associated eggs and variables.
     *
     * @throws \Everest\Exceptions\Repository\RecordNotFoundException
     */
    public function getWithEggs(int $id = null): Collection|Pack;

    /**
     * Return a pack or all packs and the count of eggs and servers for that pack.
     *
     * @throws \Everest\Exceptions\Repository\RecordNotFoundException
     */
    public function getWithCounts(int $id = null): Collection|Pack;

    /**
     * Return a pack along with its associated eggs and the servers relation on those eggs.
     *
     * @throws \Everest\Exceptions\Repository\RecordNotFoundException
     */
    public function getWithEggServers(int $id): Pack;
}
