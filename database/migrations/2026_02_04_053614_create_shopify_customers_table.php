<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shopify_customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_connection_id')->constrained()->cascadeOnDelete();
            $table->string('shopify_customer_id');
            $table->string('email')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->integer('orders_count')->default(0);
            $table->decimal('total_spent', 10, 2)->default(0);
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('country')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('accepts_marketing')->default(false);
            $table->timestamp('shopify_created_at');
            $table->timestamps();

            $table->unique(['shopify_connection_id', 'shopify_customer_id'], 'shopify_customers_conn_cust_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopify_customers');
    }
};
