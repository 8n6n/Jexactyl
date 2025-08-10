<?php

namespace Everest\Http\Requests\Api\Application\Packs;

use Everest\Models\AdminRole;
use Everest\Http\Requests\Api\Application\ApplicationApiRequest;

class GetPacksRequest extends ApplicationApiRequest
{
    public function permission(): string
    {
        return AdminRole::NESTS_READ;
    }
}
