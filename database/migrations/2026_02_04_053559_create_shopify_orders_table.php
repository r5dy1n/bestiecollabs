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
        Schema::create('shopify_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_connection_id')->constrained()->cascadeOnDelete();
            $table->string('shopify_order_id');
            $table->string('order_number');
            $table->string('email')->nullable();
            $table->decimal('total_price', 10, 2);
            $table->decimal('subtotal_price', 10, 2);
            $table->decimal('total_discounts', 10, 2);
            $table->string('currency', 3);
            $table->string('financial_status');
            $table->string('fulfillment_status')->nullable();
            $table->json('discount_codes');
            $table->integer('line_items_count');
            $table->string('customer_id')->nullable();
            $table->string('billing_city')->nullable();
            $table->string('billing_province')->nullable();
            $table->string('billing_country')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_province')->nullable();
            $table->string('shipping_country')->nullable();
            $table->timestamp('shopify_created_at');
            $table->timestamps();

            $table->unique(['shopify_connection_id', 'shopify_order_id'], 'shopify_orders_conn_order_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopify_orders');
    }
};
