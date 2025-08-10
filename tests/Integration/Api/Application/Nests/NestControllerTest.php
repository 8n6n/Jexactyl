<?php

namespace Everest\Tests\Integration\Api\Application\Packs;

use Illuminate\Http\Response;
use Everest\Contracts\Repository\PackRepositoryInterface;
use Everest\Transformers\Api\Application\PackTransformer;
use Everest\Tests\Integration\Api\Application\ApplicationApiIntegrationTestCase;

class PackControllerTest extends ApplicationApiIntegrationTestCase
{
    private PackRepositoryInterface $repository;

    /**
     * Setup tests.
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->repository = $this->app->make(PackRepositoryInterface::class);
    }

    /**
     * Test that the expected packs are returned by the request.
     */
    public function testPackResponse()
    {
        /** @var \Everest\Models\Pack[] $packs */
        $packs = $this->repository->all();

        $response = $this->getJson('/api/application/packs');
        $response->assertStatus(Response::HTTP_OK);
        $response->assertJsonCount(count($packs), 'data');
        $response->assertJsonStructure([
            'object',
            'data' => [['object', 'attributes' => ['id', 'uuid', 'author', 'name', 'description', 'created_at', 'updated_at']]],
            'meta' => ['pagination' => ['total', 'count', 'per_page', 'current_page', 'total_pages']],
        ]);

        $response->assertJson([
            'object' => 'list',
            'data' => [],
            'meta' => [
                'pagination' => [
                    'total' => 4,
                    'count' => 4,
                    'per_page' => 20,
                    'current_page' => 1,
                    'total_pages' => 1,
                ],
            ],
        ]);

        foreach ($packs as $pack) {
            $response->assertJsonFragment([
                'object' => 'pack',
                'attributes' => (new PackTransformer())->transform($pack),
            ]);
        }
    }

    /**
     * Test that getting a single pack returns the expected result.
     */
    public function testSinglePackResponse()
    {
        $pack = $this->repository->find(1);

        $response = $this->getJson('/api/application/packs/' . $pack->id);
        $response->assertStatus(Response::HTTP_OK);
        $response->assertJsonStructure([
            'object',
            'attributes' => ['id', 'uuid', 'author', 'name', 'description', 'created_at', 'updated_at'],
        ]);

        $response->assertJson([
            'object' => 'pack',
            'attributes' => (new PackTransformer())->transform($pack),
        ]);
    }

    /**
     * Test that including eggs in the response works as expected.
     */
    public function testSinglePackWithEggsIncluded()
    {
        $pack = $this->repository->find(1);
        $pack->loadMissing('eggs');

        $response = $this->getJson('/api/application/packs/' . $pack->id . '?include=servers,eggs');
        $response->assertStatus(Response::HTTP_OK);
        $response->assertJsonStructure([
            'object',
            'attributes' => [
                'relationships' => [
                    'eggs' => ['object', 'data' => []],
                    'servers' => ['object', 'data' => []],
                ],
            ],
        ]);

        $response->assertJsonCount(count($pack->getRelation('eggs')), 'attributes.relationships.eggs.data');
    }

    /**
     * Test that a missing pack returns a 404 error.
     */
    public function testGetMissingPack()
    {
        $response = $this->getJson('/api/application/packs/0');
        $this->assertNotFoundJson($response);
    }

    /**
     * Test that an authentication error occurs if a key does not have permission
     * to access a resource.
     */
    public function testErrorReturnedIfNoPermission()
    {
        $this->markTestSkipped('todo: implement proper admin api key permissions system');
    }
}
