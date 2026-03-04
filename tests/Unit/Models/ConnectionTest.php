<?php

namespace Tests\Unit\Models;

use App\Models\Brand;
use App\Models\Connection;
use App\Models\Creator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConnectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_connection_belongs_to_connectable(): void
    {
        $brand = Brand::factory()->create();
        $connection = Connection::factory()->create([
            'connectable_type' => Brand::class,
            'connectable_id' => $brand->id,
        ]);

        $this->assertInstanceOf(Brand::class, $connection->connectable);
        $this->assertEquals($brand->id, $connection->connectable->id);
    }

    public function test_is_verified_returns_true_when_verified(): void
    {
        $connection = Connection::factory()->create([
            'status' => 'verified',
            'verified_at' => now(),
        ]);

        $this->assertTrue($connection->isVerified());
    }

    public function test_is_verified_returns_false_when_not_verified(): void
    {
        $connection = Connection::factory()->create([
            'status' => 'pending',
            'verified_at' => null,
        ]);

        $this->assertFalse($connection->isVerified());
    }

    public function test_verify_updates_status_and_timestamp(): void
    {
        $connection = Connection::factory()->create([
            'status' => 'pending',
            'verified_at' => null,
        ]);

        $connection->verify();

        $this->assertEquals('verified', $connection->status);
        $this->assertNotNull($connection->verified_at);
    }
}
