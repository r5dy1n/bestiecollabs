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
        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('sender_id');
            $table->string('sender_type');
            $table->uuid('recipient_id');
            $table->string('recipient_type');
            $table->text('message_content');
            $table->boolean('read_status')->default(false);
            $table->timestamps();

            $table->index(['sender_id', 'sender_type']);
            $table->index(['recipient_id', 'recipient_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
