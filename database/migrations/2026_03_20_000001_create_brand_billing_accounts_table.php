<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brand_billing_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('brand_id')->constrained()->cascadeOnDelete();
            $table->string('stripe_customer_id')->unique()->nullable();
            $table->enum('payment_method_type', ['card', 'us_bank_account'])->nullable();
            $table->string('payment_method_id')->nullable();
            $table->boolean('ach_discount_eligible')->default(false);
            $table->timestamps();

            $table->index('stripe_customer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_billing_accounts');
    }
};
