<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportCreatorFromSocialRequest extends FormRequest
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
            'platform' => ['required', 'string', 'in:instagram,tiktok,youtube,twitter'],
            'profile_data' => ['required', 'array'],
            'profile_data.username' => ['required', 'string'],
            'profile_data.display_name' => ['nullable', 'string'],
            'profile_data.bio' => ['nullable', 'string'],
            'profile_data.follower_count' => ['nullable', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'platform.required' => 'Platform is required.',
            'platform.in' => 'Invalid platform selected.',
            'profile_data.required' => 'Profile data is required.',
            'profile_data.username.required' => 'Username is required.',
        ];
    }
}
