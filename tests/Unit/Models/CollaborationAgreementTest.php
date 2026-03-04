<?php

namespace Tests\Unit\Models;

use App\Models\Brand;
use App\Models\CollaborationAgreement;
use App\Models\CollaborationPayment;
use App\Models\Creator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollaborationAgreementTest extends TestCase
{
    use RefreshDatabase;

    public function test_agreement_belongs_to_brand(): void
    {
        $brand = Brand::factory()->create();
        $agreement = CollaborationAgreement::factory()->create([
            'brand_id' => $brand->id,
        ]);

        $this->assertInstanceOf(Brand::class, $agreement->brand);
        $this->assertEquals($brand->id, $agreement->brand->id);
    }

    public function test_agreement_belongs_to_creator(): void
    {
        $creator = Creator::factory()->create();
        $agreement = CollaborationAgreement::factory()->create([
            'creator_id' => $creator->id,
        ]);

        $this->assertInstanceOf(Creator::class, $agreement->creator);
        $this->assertEquals($creator->id, $agreement->creator->id);
    }

    public function test_agreement_has_many_payments(): void
    {
        $agreement = CollaborationAgreement::factory()->create();
        CollaborationPayment::factory()->count(3)->create([
            'agreement_id' => $agreement->id,
        ]);

        $this->assertCount(3, $agreement->payments);
    }

    public function test_total_paid_calculates_correctly(): void
    {
        $agreement = CollaborationAgreement::factory()->create();
        CollaborationPayment::factory()->completed()->create([
            'agreement_id' => $agreement->id,
            'amount' => 100.00,
        ]);
        CollaborationPayment::factory()->completed()->create([
            'agreement_id' => $agreement->id,
            'amount' => 250.00,
        ]);
        CollaborationPayment::factory()->pending()->create([
            'agreement_id' => $agreement->id,
            'amount' => 500.00, // Should not be counted
        ]);

        $this->assertEquals(350.00, $agreement->totalPaid());
    }

    public function test_is_active_returns_true_when_active(): void
    {
        $agreement = CollaborationAgreement::factory()->active()->create();

        $this->assertTrue($agreement->isActive());
    }

    public function test_is_active_returns_false_when_not_active(): void
    {
        $agreement = CollaborationAgreement::factory()->create(['status' => 'draft']);

        $this->assertFalse($agreement->isActive());
    }

    public function test_calculate_expected_payment_for_fixed_type(): void
    {
        $agreement = CollaborationAgreement::factory()->create([
            'payment_type' => 'fixed',
            'fixed_payment' => 1000.00,
        ]);

        $this->assertEquals(1000.00, $agreement->calculateExpectedPayment());
    }

    public function test_calculate_expected_payment_for_commission_type(): void
    {
        $agreement = CollaborationAgreement::factory()->create([
            'payment_type' => 'commission',
            'commission_percentage' => 20,
        ]);

        $this->assertEquals(0.0, $agreement->calculateExpectedPayment());
    }

    public function test_calculate_expected_payment_for_hybrid_type(): void
    {
        $agreement = CollaborationAgreement::factory()->create([
            'payment_type' => 'hybrid',
            'fixed_payment' => 500.00,
            'commission_percentage' => 15,
        ]);

        $this->assertEquals(500.00, $agreement->calculateExpectedPayment());
    }
}
