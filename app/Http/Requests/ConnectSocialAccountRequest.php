<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConnectSocialAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'platform' => ['required', 'string', 'in:instagram,tiktok,youtube,twitter'],
            'url' => ['required', 'url', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'platform.required' => 'Please select a platform.',
            'platform.in' => 'Invalid platform selected.',
            'url.required' => 'Please provide a URL for your social media account.',
            'url.url' => 'Please provide a valid URL.',
        ];
    }
}
