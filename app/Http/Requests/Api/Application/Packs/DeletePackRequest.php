<?php

namespace Everest\Http\Requests\Api\Application\Packs;

use Everest\Models\AdminRole;
use Everest\Http\Requests\Api\Application\ApplicationApiRequest;

class DeletePackRequest extends ApplicationApiRequest
{
    public function permission(): string
    {
        return AdminRole::NESTS_DELETE;
    }
}
