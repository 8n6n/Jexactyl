<?php

namespace Everest\Http\Requests\Api\Application\Packs;

use Everest\Models\AdminRole;

class GetPackRequest extends GetPacksRequest
{
    public function permission(): string
    {
        return AdminRole::NESTS_READ;
    }
}
