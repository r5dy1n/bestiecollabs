<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCreatorRequest extends FormRequest
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
            'creator_name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'twitter_url' => ['nullable', 'url', 'max:255'],
            'category_primary' => ['required', 'string', 'max:255'],
            'category_secondary' => ['nullable', 'string', 'max:255'],
            'category_tertiary' => ['nullable', 'string', 'max:255'],
            'followers_demographs' => ['nullable', 'array'],
            'follower_age_min' => ['required', 'integer', 'min:18', 'max:100'],
            'follower_age_max' => ['required', 'integer', 'min:18', 'max:100', 'gte:follower_age_min'],
            'language' => ['required', 'string', 'max:255'],
            'us_based' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'follower_age_max.gte' => 'The maximum follower age must be greater than or equal to the minimum follower age.',
        ];
    }
}
