<?php

namespace App\Actions\Fortify;

use App\Enums\UserType;
use App\Models\Brand;
use App\Models\Creator;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'user_type' => ['required', new Enum(UserType::class)],
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'user_type' => $input['user_type'],
            'password' => $input['password'],
        ]);

        match ($user->user_type) {
            UserType::Brand => Brand::create([
                'user_id' => $user->id,
                'brand_name' => $user->name,
                'website_url' => '',
                'category_primary' => '',
                'description' => '',
                'customer_age_min' => 0,
                'customer_age_max' => 0,
            ]),
            UserType::Creator => Creator::create([
                'user_id' => $user->id,
                'creator_name' => $user->name,
                'category_primary' => '',
                'description' => '',
                'language' => 'en',
                'follower_age_min' => 0,
                'follower_age_max' => 0,
            ]),
            default => null,
        };

        return $user;
    }
}
