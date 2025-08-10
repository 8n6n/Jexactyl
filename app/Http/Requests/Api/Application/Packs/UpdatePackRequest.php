<?php

namespace Everest\Http\Requests\Api\Application\Packs;

use Everest\Models\Pack;
use Everest\Models\AdminRole;

class UpdatePackRequest extends StorePackRequest
{
    public function rules(array $rules = null): array
    {
        return $rules ?? Pack::getRulesForUpdate($this->route()->parameter('pack'));
    }

    public function permission(): string
    {
        return AdminRole::NESTS_UPDATE;
    }
}
