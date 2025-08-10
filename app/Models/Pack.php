<?php

namespace Everest\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $uuid
 * @property string $author
 * @property string $name
 * @property string|null $description
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Illuminate\Database\Eloquent\Collection|\Everest\Models\Server[] $servers
 * @property \Illuminate\Database\Eloquent\Collection|\Everest\Models\Egg[] $eggs
 */
class Pack extends Model
{
    /**
     * The resource name for this model when it is transformed into an
     * API representation using fractal.
     */
    public const RESOURCE_NAME = 'pack';

    /**
     * The table associated with the model.
     */
    protected $table = 'packs';

    /**
     * Fields that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
    ];

    public static array $validationRules = [
        'author' => 'required|string|email',
        'name' => 'required|string|max:191',
        'description' => 'nullable|string',
    ];

    /**
     * Gets all eggs associated with this service.
     */
    public function eggs(): HasMany
    {
        return $this->hasMany(Egg::class);
    }

    /**
     * Gets all servers associated with this pack.
     */
    public function servers(): HasMany
    {
        return $this->hasMany(Server::class);
    }
}
