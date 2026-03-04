<?php

namespace Tests\Feature\Admin;

use App\Models\Brand;
use App\Models\CollaborationAgreement;
use App\Models\Creator;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollaborationAgreementControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['is_admin' => true]);
    }

    public function test_index_displays_agreements(): void
    {
        CollaborationAgreement::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.agreements.index'));

        $response->assertStatus(200);
    }

    public function test_create_displays_form(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.agreements.create'));

        $response->assertStatus(200);
    }

    public function test_store_creates_agreement(): void
    {
        $brand = Brand::factory()->create();
        $creator = Creator::factory()->create();

        $response = $this->actingAs($this->admin)
            ->post(route('admin.agreements.store'), [
                'brand_id' => $brand->id,
                'creator_id' => $creator->id,
                'title' => 'Test Campaign',
                'description' => 'Test description',
                'payment_type' => 'fixed',
                'fixed_payment' => 1000.00,
                'content_deliverables' => 3,
                'generate_script' => false,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('collaboration_agreements', [
            'brand_id' => $brand->id,
            'creator_id' => $creator->id,
            'title' => 'Test Campaign',
        ]);
    }

    public function test_store_generates_script_when_requested(): void
    {
        $brand = Brand::factory()->create();
        $creator = Creator::factory()->create();

        $response = $this->actingAs($this->admin)
            ->post(route('admin.agreements.store'), [
                'brand_id' => $brand->id,
                'creator_id' => $creator->id,
                'title' => 'Test Campaign',
                'payment_type' => 'fixed',
                'fixed_payment' => 1000.00,
                'content_deliverables' => 3,
                'generate_script' => true,
            ]);

        $response->assertRedirect();
        $agreement = CollaborationAgreement::where('title', 'Test Campaign')->first();
        $this->assertNotNull($agreement->ai_generated_script);
    }

    public function test_show_displays_agreement(): void
    {
        $agreement = CollaborationAgreement::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.agreements.show', $agreement));

        $response->assertStatus(200);
    }

    public function test_edit_displays_form(): void
    {
        $agreement = CollaborationAgreement::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.agreements.edit', $agreement));

        $response->assertStatus(200);
    }

    public function test_update_modifies_agreement(): void
    {
        $agreement = CollaborationAgreement::factory()->create();

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.agreements.update', $agreement), [
                'title' => 'Updated Campaign',
                'status' => 'active',
                'payment_type' => 'fixed',
                'fixed_payment' => 2000.00,
                'content_deliverables' => 5,
            ]);

        $response->assertRedirect();
        $this->assertEquals('Updated Campaign', $agreement->fresh()->title);
        $this->assertEquals('active', $agreement->fresh()->status);
    }

    public function test_regenerate_script_updates_script(): void
    {
        $agreement = CollaborationAgreement::factory()->create([
            'ai_generated_script' => 'Old script',
        ]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.agreements.regenerate-script', $agreement));

        $response->assertRedirect();
        $this->assertNotEquals('Old script', $agreement->fresh()->ai_generated_script);
    }

    public function test_destroy_deletes_agreement(): void
    {
        $agreement = CollaborationAgreement::factory()->create();

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.agreements.destroy', $agreement));

        $response->assertRedirect();
        $this->assertDatabaseMissing('collaboration_agreements', ['id' => $agreement->id]);
    }
}
