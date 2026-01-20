<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'brand_name' => ['required', 'string', 'max:255'],
            'website_url' => ['required', 'url', 'max:255'],
            'category_primary' => ['required', 'string', 'max:255'],
            'category_secondary' => ['nullable', 'string', 'max:255'],
            'category_tertiary' => ['nullable', 'string', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
            'description' => ['required', 'string'],
            'customer_age_min' => ['required', 'integer', 'min:18', 'max:100'],
            'customer_age_max' => ['required', 'integer', 'min:18', 'max:100', 'gte:customer_age_min'],
            'us_based' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_age_max.gte' => 'The maximum customer age must be greater than or equal to the minimum customer age.',
        ];
    }
}
