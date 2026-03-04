<?php

namespace Tests\Feature\Admin;

use App\Models\Brand;
use App\Models\Connection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConnectionControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['is_admin' => true]);
    }

    public function test_index_displays_connections(): void
    {
        Connection::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.connections.index'));

        $response->assertStatus(200);
    }

    public function test_create_displays_form(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.connections.create'));

        $response->assertStatus(200);
    }

    public function test_store_creates_connection(): void
    {
        $brand = Brand::factory()->create();

        $response = $this->actingAs($this->admin)
            ->post(route('admin.connections.store'), [
                'connectable_type' => Brand::class,
                'connectable_id' => $brand->id,
                'status' => 'pending',
                'connection_type' => 'instagram',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('connections', [
            'connectable_type' => Brand::class,
            'connectable_id' => $brand->id,
            'status' => 'pending',
        ]);
    }

    public function test_show_displays_connection(): void
    {
        $connection = Connection::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.connections.show', $connection));

        $response->assertStatus(200);
    }

    public function test_update_status_changes_connection_status(): void
    {
        $connection = Connection::factory()->pending()->create();

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.connections.update-status', $connection), [
                'status' => 'verified',
            ]);

        $response->assertRedirect();
        $this->assertEquals('verified', $connection->fresh()->status);
    }

    public function test_destroy_deletes_connection(): void
    {
        $connection = Connection::factory()->create();

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.connections.destroy', $connection));

        $response->assertRedirect();
        $this->assertDatabaseMissing('connections', ['id' => $connection->id]);
    }

    public function test_non_admin_cannot_access_connections(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($user)
            ->get(route('admin.connections.index'));

        $response->assertStatus(403);
    }
}
