<?php

namespace Tests\Feature;

use App\Models\Brand;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_brand_with_all_fields(): void
    {
        $brand = Brand::factory()->create([
            'brand_name' => 'Test Brand',
            'website_url' => 'https://testbrand.com',
            'category_primary' => 'Fashion',
            'category_secondary' => 'Lifestyle',
            'category_tertiary' => 'Beauty',
            'instagram_url' => 'https://instagram.com/testbrand',
            'tiktok_url' => 'https://tiktok.com/@testbrand',
            'description' => 'A test brand description',
            'customer_age_min' => 18,
            'customer_age_max' => 35,
            'us_based' => true,
        ]);

        $this->assertDatabaseHas('brands', [
            'brand_name' => 'Test Brand',
            'website_url' => 'https://testbrand.com',
            'category_primary' => 'Fashion',
            'us_based' => true,
        ]);

        $this->assertEquals('Test Brand', $brand->brand_name);
        $this->assertEquals(18, $brand->customer_age_min);
        $this->assertEquals(35, $brand->customer_age_max);
        $this->assertTrue($brand->us_based);
    }

    public function test_can_create_brand_with_only_required_fields(): void
    {
        $brand = Brand::factory()->create([
            'brand_name' => 'Minimal Brand',
            'website_url' => 'https://minimal.com',
            'category_primary' => 'Tech',
            'description' => 'Minimal description',
            'customer_age_min' => 25,
            'customer_age_max' => 50,
        ]);

        $this->assertDatabaseHas('brands', [
            'brand_name' => 'Minimal Brand',
            'category_primary' => 'Tech',
        ]);

        $this->assertNull($brand->category_secondary);
        $this->assertNull($brand->category_tertiary);
        $this->assertNull($brand->instagram_url);
        $this->assertNull($brand->tiktok_url);
    }

    public function test_brand_uses_uuid_as_primary_key(): void
    {
        $brand = Brand::factory()->create();

        $this->assertIsString($brand->id);
        $this->assertMatchesRegularExpression('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/', $brand->id);
    }

    public function test_brand_casts_age_fields_to_integers(): void
    {
        $brand = Brand::factory()->create([
            'customer_age_min' => '21',
            'customer_age_max' => '45',
        ]);

        $this->assertIsInt($brand->customer_age_min);
        $this->assertIsInt($brand->customer_age_max);
    }

    public function test_brand_casts_us_based_to_boolean(): void
    {
        $brand = Brand::factory()->create([
            'us_based' => 1,
        ]);

        $this->assertIsBool($brand->us_based);
        $this->assertTrue($brand->us_based);
    }

    public function test_can_update_brand(): void
    {
        $brand = Brand::factory()->create();

        $brand->update([
            'brand_name' => 'Updated Brand Name',
            'customer_age_max' => 60,
        ]);

        $this->assertEquals('Updated Brand Name', $brand->fresh()->brand_name);
        $this->assertEquals(60, $brand->fresh()->customer_age_max);
    }

    public function test_can_delete_brand(): void
    {
        $brand = Brand::factory()->create();
        $brandId = $brand->id;

        $brand->delete();

        $this->assertDatabaseMissing('brands', [
            'id' => $brandId,
        ]);
    }
}
