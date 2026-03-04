<?php

namespace Tests\Feature\Admin;

use App\Models\CollaborationAgreement;
use App\Models\CollaborationPayment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollaborationPaymentControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['is_admin' => true]);
    }

    public function test_index_displays_payments(): void
    {
        CollaborationPayment::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.payments.index'));

        $response->assertStatus(200);
    }

    public function test_create_displays_form(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.payments.create'));

        $response->assertStatus(200);
    }

    public function test_store_creates_payment(): void
    {
        $agreement = CollaborationAgreement::factory()->create();

        $response = $this->actingAs($this->admin)
            ->post(route('admin.payments.store'), [
                'agreement_id' => $agreement->id,
                'amount' => 500.00,
                'status' => 'pending',
                'payment_method' => 'manual',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('collaboration_payments', [
            'agreement_id' => $agreement->id,
            'amount' => 500.00,
            'status' => 'pending',
        ]);
    }

    public function test_store_sets_paid_at_for_completed_payments(): void
    {
        $agreement = CollaborationAgreement::factory()->create();

        $response = $this->actingAs($this->admin)
            ->post(route('admin.payments.store'), [
                'agreement_id' => $agreement->id,
                'amount' => 500.00,
                'status' => 'completed',
                'payment_method' => 'manual',
                'transaction_id' => 'txn_123',
            ]);

        $response->assertRedirect();
        $payment = CollaborationPayment::where('agreement_id', $agreement->id)->first();
        $this->assertNotNull($payment->paid_at);
    }

    public function test_show_displays_payment(): void
    {
        $payment = CollaborationPayment::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.payments.show', $payment));

        $response->assertStatus(200);
    }

    public function test_edit_displays_form(): void
    {
        $payment = CollaborationPayment::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.payments.edit', $payment));

        $response->assertStatus(200);
    }

    public function test_update_modifies_payment(): void
    {
        $payment = CollaborationPayment::factory()->pending()->create();

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.payments.update', $payment), [
                'amount' => 750.00,
                'status' => 'processing',
                'payment_method' => 'stripe',
            ]);

        $response->assertRedirect();
        $this->assertEquals(750.00, $payment->fresh()->amount);
        $this->assertEquals('processing', $payment->fresh()->status);
    }

    public function test_mark_as_paid_updates_payment(): void
    {
        $payment = CollaborationPayment::factory()->pending()->create();

        $response = $this->actingAs($this->admin)
            ->post(route('admin.payments.mark-paid', $payment), [
                'transaction_id' => 'txn_456',
            ]);

        $response->assertRedirect();
        $payment->refresh();
        $this->assertEquals('completed', $payment->status);
        $this->assertEquals('txn_456', $payment->transaction_id);
        $this->assertNotNull($payment->paid_at);
    }

    public function test_destroy_deletes_payment(): void
    {
        $payment = CollaborationPayment::factory()->create();

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.payments.destroy', $payment));

        $response->assertRedirect();
        $this->assertDatabaseMissing('collaboration_payments', ['id' => $payment->id]);
    }
}
