<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDraftOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        $connection = $this->user()?->shopifyConnection;

        return $connection && $connection->hasScope('write_orders');
    }

    public function rules(): array
    {
        return [
            'line_items' => ['required', 'array', 'min:1'],
            'line_items.*.title' => ['required', 'string'],
            'line_items.*.price' => ['required', 'numeric', 'min:0'],
            'line_items.*.quantity' => ['required', 'integer', 'min:1'],
            'customer_email' => ['nullable', 'email'],
            'note' => ['nullable', 'string', 'max:5000'],
            'tags' => ['nullable', 'string'],
            'discount_code' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'line_items.required' => 'At least one line item is required.',
            'line_items.min' => 'At least one line item is required.',
            'line_items.*.title.required' => 'Each line item must have a title.',
            'line_items.*.price.required' => 'Each line item must have a price.',
            'line_items.*.quantity.required' => 'Each line item must have a quantity.',
        ];
    }
}
