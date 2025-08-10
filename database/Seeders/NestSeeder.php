<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Everest\Services\Packs\PackCreationService;
use Everest\Contracts\Repository\PackRepositoryInterface;

class PackSeeder extends Seeder
{
    /**
     * @var \Everest\Services\Packs\PackCreationService
     */
    private $creationService;

    /**
     * @var \Everest\Contracts\Repository\PackRepositoryInterface
     */
    private $repository;

    /**
     * PackSeeder constructor.
     */
    public function __construct(
        PackCreationService $creationService,
        PackRepositoryInterface $repository
    ) {
        $this->creationService = $creationService;
        $this->repository = $repository;
    }

    /**
     * Run the seeder to add missing packs to the Panel.
     *
     * @throws \Everest\Exceptions\Model\DataValidationException
     */
    public function run()
    {
        $items = $this->repository->findWhere([
            'author' => 'support@pterodactyl.io',
        ])->keyBy('name')->toArray();

        $this->createMinecraftPack(array_get($items, 'Minecraft'));
        $this->createSourceEnginePack(array_get($items, 'Source Engine'));
        $this->createVoiceServersPack(array_get($items, 'Voice Servers'));
        $this->createRustPack(array_get($items, 'Rust'));
    }

    /**
     * Create the Minecraft pack to be used later on.
     *
     * @throws \Everest\Exceptions\Model\DataValidationException
     */
    private function createMinecraftPack(array $pack = null)
    {
        if (is_null($pack)) {
            $this->creationService->handle([
                'name' => 'Minecraft',
                'description' => 'Minecraft - the classic game from Mojang. With support for Vanilla MC, Spigot, and many others!',
            ], 'support@pterodactyl.io');
        }
    }

    /**
     * Create the Source Engine Games pack to be used later on.
     *
     * @throws \Everest\Exceptions\Model\DataValidationException
     */
    private function createSourceEnginePack(array $pack = null)
    {
        if (is_null($pack)) {
            $this->creationService->handle([
                'name' => 'Source Engine',
                'description' => 'Includes support for most Source Dedicated Server games.',
            ], 'support@pterodactyl.io');
        }
    }

    /**
     * Create the Voice Servers pack to be used later on.
     *
     * @throws \Everest\Exceptions\Model\DataValidationException
     */
    private function createVoiceServersPack(array $pack = null)
    {
        if (is_null($pack)) {
            $this->creationService->handle([
                'name' => 'Voice Servers',
                'description' => 'Voice servers such as Mumble and Teamspeak 3.',
            ], 'support@pterodactyl.io');
        }
    }

    /**
     * Create the Rust pack to be used later on.
     *
     * @throws \Everest\Exceptions\Model\DataValidationException
     */
    private function createRustPack(array $pack = null)
    {
        if (is_null($pack)) {
            $this->creationService->handle([
                'name' => 'Rust',
                'description' => 'Rust - A game where you must fight to survive.',
            ], 'support@pterodactyl.io');
        }
    }
}
