<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brand_invoice_line_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('invoice_id')->constrained('brand_invoices')->cascadeOnDelete();
            $table->foreignUuid('collaboration_id')->nullable()->constrained()->nullOnDelete();
            $table->string('description');
            $table->enum('type', ['charge', 'fee', 'credit', 'refund', 'adjustment']);
            $table->decimal('amount', 10, 2);
            $table->timestamps();

            $table->index(['invoice_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_invoice_line_items');
    }
};
