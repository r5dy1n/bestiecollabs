<?php

namespace Tests\Unit\Models;

use App\Models\CollaborationAgreement;
use App\Models\CollaborationPayment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollaborationPaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_payment_belongs_to_agreement(): void
    {
        $agreement = CollaborationAgreement::factory()->create();
        $payment = CollaborationPayment::factory()->create([
            'agreement_id' => $agreement->id,
        ]);

        $this->assertInstanceOf(CollaborationAgreement::class, $payment->agreement);
        $this->assertEquals($agreement->id, $payment->agreement->id);
    }

    public function test_mark_as_paid_updates_status_and_timestamp(): void
    {
        $payment = CollaborationPayment::factory()->pending()->create();

        $payment->markAsPaid('txn_123456');

        $this->assertEquals('completed', $payment->status);
        $this->assertEquals('txn_123456', $payment->transaction_id);
        $this->assertNotNull($payment->paid_at);
    }

    public function test_is_paid_returns_true_when_completed(): void
    {
        $payment = CollaborationPayment::factory()->completed()->create();

        $this->assertTrue($payment->isPaid());
    }

    public function test_is_paid_returns_false_when_pending(): void
    {
        $payment = CollaborationPayment::factory()->pending()->create();

        $this->assertFalse($payment->isPaid());
    }
}
