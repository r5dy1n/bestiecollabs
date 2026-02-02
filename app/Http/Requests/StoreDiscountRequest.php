<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiscountRequest extends FormRequest
{
    public function authorize(): bool
    {
        $connection = $this->user()?->shopifyConnection;

        return $connection && $connection->hasScope('write_price_rules');
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:255', 'regex:/^[A-Z0-9_\-]+$/'],
            'value' => ['required', 'numeric', 'gt:0'],
            'value_type' => ['required', 'in:percentage,fixed_amount'],
            'minimum_quantity' => ['nullable', 'integer', 'min:1'],
            'once_per_customer' => ['required', 'boolean'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.regex' => 'The discount code must contain only uppercase letters, numbers, hyphens, and underscores.',
            'ends_at.after' => 'The end date must be after the start date.',
            'value.gt' => 'The discount value must be greater than zero.',
        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator): void
    {
        $validator->after(function (\Illuminate\Validation\Validator $validator) {
            if ($this->input('value_type') === 'percentage' && (float) $this->input('value') > 100) {
                $validator->errors()->add('value', 'Percentage discount cannot exceed 100%.');
            }
        });
    }
}
