<?php

namespace Everest\Http\Requests\Api\Application\Packs;

use Everest\Models\Pack;
use Everest\Models\AdminRole;
use Everest\Http\Requests\Api\Application\ApplicationApiRequest;

class StorePackRequest extends ApplicationApiRequest
{
    public function rules(array $rules = null): array
    {
        return $rules ?? Pack::getRules();
    }

    public function permission(): string
    {
        return AdminRole::NESTS_CREATE;
    }
}
