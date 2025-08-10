<?php

namespace Database\Factories;

use Ramsey\Uuid\Uuid;
use Everest\Models\Pack;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Pack::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'uuid' => Uuid::uuid4()->toString(),
            'author' => 'testauthor@example.com',
            'name' => $this->faker->word,
            'description' => null,
        ];
    }
}
