<?php

namespace Everest\Repositories\Eloquent;

use Everest\Models\Pack;
use Illuminate\Database\Eloquent\Collection;
use Everest\Contracts\Repository\PackRepositoryInterface;
use Everest\Exceptions\Repository\RecordNotFoundException;

class PackRepository extends EloquentRepository implements PackRepositoryInterface
{
    /**
     * Return the model backing this repository.
     */
    public function model(): string
    {
        return Pack::class;
    }

    /**
     * Return a pack or all packs with their associated eggs and variables.
     *
     * @throws \Everest\Exceptions\Repository\RecordNotFoundException
     */
    public function getWithEggs(int $id = null): Collection|Pack
    {
        $instance = $this->getBuilder()->with('eggs', 'eggs.variables');

        if (!is_null($id)) {
            $instance = $instance->find($id, $this->getColumns());
            if (!$instance) {
                throw new RecordNotFoundException();
            }

            return $instance;
        }

        return $instance->get($this->getColumns());
    }

    /**
     * Return a pack or all packs and the count of eggs and servers for that pack.
     *
     * @throws \Everest\Exceptions\Repository\RecordNotFoundException
     */
    public function getWithCounts(int $id = null): Collection|Pack
    {
        $instance = $this->getBuilder()->withCount(['eggs', 'servers']);

        if (!is_null($id)) {
            $instance = $instance->find($id, $this->getColumns());
            if (!$instance) {
                throw new RecordNotFoundException();
            }

            return $instance;
        }

        return $instance->get($this->getColumns());
    }

    /**
     * Return a pack along with its associated eggs and the servers relation on those eggs.
     *
     * @throws \Everest\Exceptions\Repository\RecordNotFoundException
     */
    public function getWithEggServers(int $id): Pack
    {
        $instance = $this->getBuilder()->with('eggs.servers')->find($id, $this->getColumns());
        if (!$instance) {
            throw new RecordNotFoundException();
        }

        /* @var Pack $instance */
        return $instance;
    }
}
