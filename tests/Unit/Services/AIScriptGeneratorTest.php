<?php

namespace Tests\Unit\Services;

use App\Models\Brand;
use App\Models\CollaborationAgreement;
use App\Models\Creator;
use App\Services\AIScriptGenerator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AIScriptGeneratorTest extends TestCase
{
    use RefreshDatabase;

    private AIScriptGenerator $generator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->generator = new AIScriptGenerator();
    }

    public function test_generate_creates_script_with_brand_and_creator_names(): void
    {
        $brand = Brand::factory()->create(['brand_name' => 'TestBrand']);
        $creator = Creator::factory()->create(['creator_name' => 'TestCreator']);
        $agreement = CollaborationAgreement::factory()->create([
            'brand_id' => $brand->id,
            'creator_id' => $creator->id,
            'title' => 'Test Campaign',
        ]);

        $script = $this->generator->generate($agreement);

        $this->assertStringContainsString('TestBrand', $script);
        $this->assertStringContainsString('TestCreator', $script);
        $this->assertStringContainsString('Test Campaign', $script);
    }

    public function test_generate_includes_content_structure(): void
    {
        $agreement = CollaborationAgreement::factory()->create();

        $script = $this->generator->generate($agreement);

        $this->assertStringContainsString('Opening Hook', $script);
        $this->assertStringContainsString('Problem/Pain Point', $script);
        $this->assertStringContainsString('Solution Introduction', $script);
        $this->assertStringContainsString('Key Benefits', $script);
        $this->assertStringContainsString('Call to Action', $script);
    }

    public function test_generate_includes_payment_details_for_fixed_type(): void
    {
        $agreement = CollaborationAgreement::factory()->create([
            'payment_type' => 'fixed',
            'fixed_payment' => 1500.00,
        ]);

        $script = $this->generator->generate($agreement);

        $this->assertStringContainsString('Fixed Payment', $script);
        $this->assertStringContainsString('$1500', $script);
    }

    public function test_generate_includes_payment_details_for_commission_type(): void
    {
        $agreement = CollaborationAgreement::factory()->create([
            'payment_type' => 'commission',
            'commission_percentage' => 20.00,
        ]);

        $script = $this->generator->generate($agreement);

        $this->assertStringContainsString('Commission', $script);
        $this->assertStringContainsString('20%', $script);
    }

    public function test_generate_includes_deliverables_count(): void
    {
        $agreement = CollaborationAgreement::factory()->create([
            'content_deliverables' => 5,
        ]);

        $script = $this->generator->generate($agreement);

        $this->assertStringContainsString('Content Pieces: 5', $script);
    }

    public function test_generate_includes_category_specific_hooks(): void
    {
        $brand = Brand::factory()->create(['category_primary' => 'fashion']);
        $agreement = CollaborationAgreement::factory()->create([
            'brand_id' => $brand->id,
        ]);

        $script = $this->generator->generate($agreement);

        $this->assertStringContainsString('Suggested Hooks', $script);
    }
}
