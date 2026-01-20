<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SocialMediaSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'query' => ['required', 'string', 'min:3', 'max:255'],
            'platform' => ['required', 'string', 'in:instagram,tiktok,youtube,twitter'],
        ];
    }

    public function messages(): array
    {
        return [
            'query.required' => 'Please enter a search query.',
            'query.min' => 'Search query must be at least 3 characters.',
            'platform.required' => 'Please select a platform.',
            'platform.in' => 'Invalid platform selected.',
        ];
    }
}
